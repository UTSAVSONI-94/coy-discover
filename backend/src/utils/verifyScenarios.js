const BASE_URL = 'http://localhost:5001/api';
const { seedDatabase } = require('../database/seed');

async function runScenarioValidation() {
  console.log('===============================================================');
  console.log('       STAGE 6: MUTUAL MATCH & PRIVACY SCENARIO VALIDATION     ');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Start with a clean reset so we can deterministically test Scenarios A, B, C, D
    console.log('[Setup] Seeding database to pristine demo state...');
    seedDatabase({ reset: true });

    // Step 0: Privacy Validation on Feed
    console.log('\n--- Privacy Verification ---');
    const initialFeedRes = await fetch(`${BASE_URL}/feed`);
    const initialFeed = await initialFeedRes.json();
    assert(initialFeed.success === true, 'Feed endpoint responds with success');
    assert(initialFeed.count === 32, `Feed returns 32 candidates (Received: ${initialFeed.count})`);

    const hasPrivacyLeak = initialFeed.data.some(
      (p) =>
        p.hasLiked !== undefined ||
        p.isMatch !== undefined ||
        p.incomingLike !== undefined ||
        p.liked !== undefined ||
        p.swiper_id !== undefined ||
        p.swiped_id !== undefined
    );
    assert(!hasPrivacyLeak, 'PRIVACY GUARANTEE: Feed payload contains zero incoming-like flags or swipe history');

    // SCENARIO A: Profile A (Maya Lin, ID 2) has already liked demo user. Demo user likes Maya Lin.
    console.log('\n--- Scenario A: Mutual Like triggers Match ---');
    const scenarioARes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
    });
    const scenarioAData = await scenarioARes.json();
    assert(scenarioARes.status === 200, 'Swipe on Profile 2 returns 200 OK');
    assert(scenarioAData.isMatch === true, 'Profile 2 (Maya Lin) triggered mutual match (isMatch: true)');
    assert(
      scenarioAData.match && scenarioAData.match.profile.name === 'Maya Lin',
      'Match object returned with Maya Lin profile details'
    );

    // Verify Maya Lin appears in Matches view
    const matchesResA = await fetch(`${BASE_URL}/matches`);
    const matchesDataA = await matchesResA.json();
    assert(matchesDataA.count === 1, `Matches count is 1 (Received: ${matchesDataA.count})`);
    assert(matchesDataA.data[0].profile.name === 'Maya Lin', 'Matches view displays Maya Lin');

    // SCENARIO B: Profile B (Chloe Dubois, ID 4) has not liked demo user. Demo user likes Chloe Dubois.
    console.log('\n--- Scenario B: One-sided Like does NOT trigger Match ---');
    const scenarioBRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    const scenarioBData = await scenarioBRes.json();
    assert(scenarioBRes.status === 200, 'Swipe on Profile 4 returns 200 OK');
    assert(scenarioBData.isMatch === false, 'Profile 4 (Chloe Dubois) does NOT trigger match (isMatch: false)');
    assert(!scenarioBData.match, 'No match object returned for one-sided like');

    // Verify Matches view STILL only contains Maya Lin (NOT Chloe)
    const matchesResB = await fetch(`${BASE_URL}/matches`);
    const matchesDataB = await matchesResB.json();
    assert(matchesDataB.count === 1, 'Matches count remains 1');
    assert(!matchesDataB.data.some((m) => m.profile.id === 4), 'One-sided like for Chloe Dubois is NOT in Matches');

    // SCENARIO C: The demo user passes Profile C (Lucas Silva, ID 3).
    console.log('\n--- Scenario C: Pass action excludes Profile from Feed ---');
    const scenarioCRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 3, action: 'PASS' }),
    });
    const scenarioCData = await scenarioCRes.json();
    assert(scenarioCRes.status === 200, 'Pass on Profile 3 returns 200 OK');
    assert(scenarioCData.action === 'PASS' && scenarioCData.isMatch === false, 'Pass recorded with isMatch: false');

    // Verify Feed no longer has Profile 2 (Maya), Profile 4 (Chloe), or Profile 3 (Lucas)
    const feedResC = await fetch(`${BASE_URL}/feed`);
    const feedDataC = await feedResC.json();
    assert(feedDataC.count === 29, `Feed reduced from 32 to 29 profiles (Received: ${feedDataC.count})`);
    const excludedIds = [2, 3, 4];
    const anyExcludedPresent = feedDataC.data.some((p) => excludedIds.includes(p.id));
    assert(!anyExcludedPresent, 'Profiles 2, 3, and 4 are completely absent from the feed');

    // SCENARIO D: Application Reload Persistence
    console.log('\n--- Scenario D: Persistence across App Reload ---');
    // Simulate fresh request to feed and matches
    const reloadedFeedRes = await fetch(`${BASE_URL}/feed`);
    const reloadedFeed = await reloadedFeedRes.json();
    assert(reloadedFeed.count === 29, `Reloaded feed persists exclusion of swiped profiles (Count: ${reloadedFeed.count})`);

    const reloadedMatchesRes = await fetch(`${BASE_URL}/matches`);
    const reloadedMatches = await reloadedMatchesRes.json();
    assert(reloadedMatches.count === 1, `Reloaded matches persists mutual match (Count: ${reloadedMatches.count})`);
    assert(reloadedMatches.data[0].profile.name === 'Maya Lin', 'Maya Lin remains in persisted matches');
    assert(!reloadedMatches.data.some((m) => m.profile.id === 3 || m.profile.id === 4), 'No one-sided likes leaked into matches');

    // Verify duplicate match attempt is prevented
    const dupSwipe = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
    });
    assert(dupSwipe.status === 409, 'Duplicate swipe on Maya Lin safely rejected with 409 Conflict');

    // Clean reset for user demonstration
    console.log('\n[Teardown] Re-seeding database so live app is ready for demonstration...');
    seedDatabase({ reset: true });

    console.log('\n===============================================================');
    console.log(`TOTAL SCENARIO TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('===============================================================\n');

    return failed === 0;
  } catch (err) {
    console.error('Scenario testing error:', err);
    return false;
  }
}

if (require.main === module) {
  runScenarioValidation().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runScenarioValidation;

