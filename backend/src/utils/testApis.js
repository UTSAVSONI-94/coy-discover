const BASE_URL = 'http://localhost:5001/api';

async function runApiTests() {
  console.log('==============================================');
  console.log('       RUNNING BACKEND API TEST SUITE        ');
  console.log('==============================================\n');

  // Ensure test begins with a clean state
  const { seedDatabase } = require('../database/seed');
  seedDatabase({ reset: true });

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
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Initial Feed
    const feedRes1 = await fetch(`${BASE_URL}/feed`);
    const feedData1 = await feedRes1.json();
    assert(feedRes1.status === 200 && feedData1.success === true, 'GET /api/feed returns 200 OK');
    assert(feedData1.count === 32, `Initial feed contains all 32 candidates (Received: ${feedData1.count})`);

    // Verify Demo User (ID 1) is NOT in the feed
    const hasDemoUser = feedData1.data.some((p) => p.id === 1);
    assert(!hasDemoUser, 'Demo user (ID 1) is excluded from the feed');

    // Verify Privacy: No incoming like status exposed in any profile
    const privacyLeak = feedData1.data.some((p) =>
      p.hasLiked !== undefined ||
      p.isMatch !== undefined ||
      p.liked !== undefined ||
      p.incoming !== undefined ||
      p.swiper_id !== undefined
    );
    assert(!privacyLeak, 'Privacy enforced: Zero incoming like flags in feed payload');

    // 3. Input Validation Tests for POST /api/swipe
    const emptySwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(emptySwipeRes.status === 400, 'POST /api/swipe returns 400 on missing body fields');

    const selfSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 1, action: 'LIKE' }),
    });
    assert(selfSwipeRes.status === 400, 'POST /api/swipe returns 400 when swiping on own profile');

    const invalidActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 3, action: 'SUPERLIKE' }),
    });
    assert(invalidActionRes.status === 400, 'POST /api/swipe returns 400 on invalid action ("SUPERLIKE")');

    const nonExistentRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 99999, action: 'PASS' }),
    });
    assert(nonExistentRes.status === 404, 'POST /api/swipe returns 404 for non-existent profile');

    // 4. Test PASS Action on Profile 3 (Lucas Silva)
    const passRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 3, action: 'PASS' }),
    });
    const passData = await passRes.json();
    assert(
      passRes.status === 200 && passData.action === 'PASS' && passData.isMatch === false,
      'POST /api/swipe with PASS returns { action: "PASS", isMatch: false }'
    );

    // Verify Profile 3 is removed from Feed
    const feedRes2 = await fetch(`${BASE_URL}/feed`);
    const feedData2 = await feedRes2.json();
    assert(feedData2.count === 31, `Feed count decremented to 31 after PASS (Received: ${feedData2.count})`);
    assert(!feedData2.data.some((p) => p.id === 3), 'Passed profile (ID 3) disappears from feed');

    // 5. Test One-Sided LIKE on Profile 4 (Chloe Dubois - has NOT liked demo user)
    const oneSidedRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    const oneSidedData = await oneSidedRes.json();
    assert(
      oneSidedRes.status === 200 && oneSidedData.action === 'LIKE' && oneSidedData.isMatch === false,
      'POST /api/swipe with one-sided LIKE returns { action: "LIKE", isMatch: false }'
    );

    // Verify Profile 4 disappears from Feed
    const feedRes3 = await fetch(`${BASE_URL}/feed`);
    const feedData3 = await feedRes3.json();
    assert(feedData3.count === 30, `Feed count decremented to 30 after LIKE (Received: ${feedData3.count})`);
    assert(!feedData3.data.some((p) => p.id === 4), 'Swiped profile (ID 4) disappears from feed');

    // 6. Test Duplicate Swipe on Profile 4
    const dupSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    assert(dupSwipeRes.status === 409, 'POST /api/swipe rejects duplicate swipe with 409 Conflict');

    // 7. Test Mutual LIKE on Profile 2 (Maya Lin - pre-existing liker)
    const mutualRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
    });
    const mutualData = await mutualRes.json();
    assert(
      mutualRes.status === 200 &&
      mutualData.action === 'LIKE' &&
      mutualData.isMatch === true &&
      mutualData.match &&
      mutualData.match.profile.id === 2 &&
      mutualData.match.profile.name === 'Maya Lin',
      'POST /api/swipe with reciprocal liker returns { isMatch: true, match: { profile: { id: 2, name: "Maya Lin" } } }'
    );

    // 8. Test GET /api/matches
    const matchesRes = await fetch(`${BASE_URL}/matches`);
    const matchesData = await matchesRes.json();
    assert(matchesRes.status === 200 && matchesData.success === true, 'GET /api/matches returns 200 OK');
    assert(matchesData.count === 1, `Matches count is 1 (Received: ${matchesData.count})`);
    assert(matchesData.data[0].profile.id === 2, 'Matches list contains Maya Lin (ID 2)');
    assert(
      !matchesData.data.some((m) => m.profile.id === 3 || m.profile.id === 4),
      'Matches list strictly excludes PASS (ID 3) and one-sided LIKE (ID 4)'
    );

    // 9. Re-seed to reset test state cleanly for app demo
    console.log('\n--- Re-seeding database with reset=true to restore clean state for upcoming UI stages ---');
    const { seedDatabase } = require('../database/seed');
    seedDatabase({ reset: true });

    // Verify clean feed after re-seed
    const cleanFeedRes = await fetch(`${BASE_URL}/feed`);
    const cleanFeedData = await cleanFeedRes.json();
    assert(cleanFeedData.count === 32, 'Feed restored to full 32 candidate profiles after clean re-seed');

    console.log('\n==============================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('==============================================');

    return failed === 0;
  } catch (err) {
    console.error('Test execution error:', err);
    return false;
  }
}

if (require.main === module) {
  runApiTests().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runApiTests;
