const BASE_URL = 'http://localhost:5001/api';
const { seedDatabase } = require('../database/seed');

async function runScenarioValidation() {
  console.log('\nValidating matching scenarios (A, B, C, D)...\n');
  seedDatabase({ reset: true });

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✕ ${message}`);
      failed++;
    }
  }

  try {
    const feedRes = await fetch(`${BASE_URL}/feed`);
    const feed = await feedRes.json();
    assert(feed.success && feed.count === 32, 'Feed returns 32 candidates initially');

    const leak = feed.data.some(
      (p) =>
        p.hasLiked !== undefined ||
        p.isMatch !== undefined ||
        p.incomingLike !== undefined ||
        p.liked !== undefined ||
        p.swiper_id !== undefined
    );
    assert(!leak, 'Feed payload omits any incoming-like or swipe history');

    // Scenario A: Profile 2 already liked demo user -> Mutual like creates match
    const scenarioARes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
    });
    const scenarioAData = await scenarioARes.json();
    assert(scenarioARes.status === 200, 'Scenario A: POST /api/swipe returns 200');
    assert(scenarioAData.isMatch === true, 'Scenario A: Reciprocal like returns isMatch: true');
    assert(
      scenarioAData.match && scenarioAData.match.profile.name === 'Maya Lin',
      'Scenario A: Match payload contains Maya Lin profile details'
    );

    const matchesResA = await fetch(`${BASE_URL}/matches`);
    const matchesA = await matchesResA.json();
    assert(matchesA.count === 1, 'Scenario A: Matches list count is 1');
    assert(matchesA.data[0].profile.name === 'Maya Lin', 'Scenario A: Matches list contains Maya Lin');

    // Scenario B: Profile 4 has not liked demo user -> One-sided like does not create match
    const scenarioBRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    const scenarioBData = await scenarioBRes.json();
    assert(scenarioBRes.status === 200, 'Scenario B: POST /api/swipe returns 200');
    assert(scenarioBData.isMatch === false, 'Scenario B: One-sided like returns isMatch: false');
    assert(!scenarioBData.match, 'Scenario B: No match payload returned');

    const matchesResB = await fetch(`${BASE_URL}/matches`);
    const matchesB = await matchesResB.json();
    assert(matchesB.count === 1, 'Scenario B: Matches count remains 1');
    assert(!matchesB.data.some((m) => m.profile.id === 4), 'Scenario B: Chloe Dubois is not in matches');

    // Scenario C: Pass profile 3 -> Excluded from feed
    const scenarioCRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 3, action: 'PASS' }),
    });
    const scenarioCData = await scenarioCRes.json();
    assert(scenarioCRes.status === 200, 'Scenario C: PASS returns 200');
    assert(scenarioCData.action === 'PASS' && scenarioCData.isMatch === false, 'Scenario C: PASS returns isMatch: false');

    const feedResC = await fetch(`${BASE_URL}/feed`);
    const feedC = await feedResC.json();
    assert(feedC.count === 29, 'Scenario C: Feed count decremented to 29');
    const anyExcluded = feedC.data.some((p) => [2, 3, 4].includes(p.id));
    assert(!anyExcluded, 'Scenario C: Profiles 2, 3, and 4 are absent from feed');

    // Scenario D: Application reload persistence
    const reloadedFeedRes = await fetch(`${BASE_URL}/feed`);
    const reloadedFeed = await reloadedFeedRes.json();
    assert(reloadedFeed.count === 29, 'Scenario D: Swiped profile exclusion persists on feed reload');

    const reloadedMatchesRes = await fetch(`${BASE_URL}/matches`);
    const reloadedMatches = await reloadedMatchesRes.json();
    assert(reloadedMatches.count === 1, 'Scenario D: Mutual matches persist on reload');
    assert(reloadedMatches.data[0].profile.name === 'Maya Lin', 'Scenario D: Maya Lin remains in matches');
    assert(!reloadedMatches.data.some((m) => m.profile.id === 3 || m.profile.id === 4), 'Scenario D: One-sided likes not in matches');

    const dupSwipe = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
    });
    assert(dupSwipe.status === 409, 'Scenario D: Duplicate swipe rejected with 409 Conflict');

    seedDatabase({ reset: true });

    console.log(`\n  Scenarios: ${passed} passed, ${failed} failed (${passed + failed} total)\n`);
    return failed === 0;
  } catch (err) {
    console.error('Scenario test error:', err);
    return false;
  }
}

if (require.main === module) {
  runScenarioValidation().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runScenarioValidation;
