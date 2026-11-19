const BASE_URL = 'http://localhost:5001/api';
const { seedDatabase } = require('../database/seed');

async function runApiTests() {
  console.log('\nRunning API integration tests...\n');
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
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200');

    const feedRes1 = await fetch(`${BASE_URL}/feed`);
    const feedData1 = await feedRes1.json();
    assert(feedRes1.status === 200 && feedData1.success === true, 'GET /api/feed returns 200');
    assert(feedData1.count === 32, 'Initial feed contains all 32 candidate profiles');

    const hasDemoUser = feedData1.data.some((p) => p.id === 1);
    assert(!hasDemoUser, 'Demo user (ID 1) is excluded from feed');

    const privacyLeak = feedData1.data.some((p) =>
      p.hasLiked !== undefined ||
      p.isMatch !== undefined ||
      p.liked !== undefined ||
      p.incoming !== undefined ||
      p.swiper_id !== undefined
    );
    assert(!privacyLeak, 'Feed payload contains no incoming like flags');

    const emptySwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(emptySwipeRes.status === 400, 'POST /api/swipe returns 400 on empty body');

    const selfSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 1, action: 'LIKE' }),
    });
    assert(selfSwipeRes.status === 400, 'POST /api/swipe returns 400 on self-swipe');

    const invalidActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 3, action: 'SUPERLIKE' }),
    });
    assert(invalidActionRes.status === 400, 'POST /api/swipe returns 400 on invalid action');

    const nonExistentRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 99999, action: 'PASS' }),
    });
    assert(nonExistentRes.status === 404, 'POST /api/swipe returns 404 for unknown profile');

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

    const feedRes2 = await fetch(`${BASE_URL}/feed`);
    const feedData2 = await feedRes2.json();
    assert(feedData2.count === 31, 'Feed count decrements to 31 after pass');
    assert(!feedData2.data.some((p) => p.id === 3), 'Passed profile is excluded from subsequent feed');

    const oneSidedRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    const oneSidedData = await oneSidedRes.json();
    assert(
      oneSidedRes.status === 200 && oneSidedData.action === 'LIKE' && oneSidedData.isMatch === false,
      'POST /api/swipe with non-reciprocal LIKE returns isMatch: false'
    );

    const feedRes3 = await fetch(`${BASE_URL}/feed`);
    const feedData3 = await feedRes3.json();
    assert(feedData3.count === 30, 'Feed count decrements to 30 after like');
    assert(!feedData3.data.some((p) => p.id === 4), 'Liked profile is excluded from subsequent feed');

    const dupSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 4, action: 'LIKE' }),
    });
    assert(dupSwipeRes.status === 409, 'POST /api/swipe returns 409 Conflict on duplicate swipe');

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
      mutualData.match.profile.id === 2,
      'POST /api/swipe with reciprocal liker returns isMatch: true with match profile'
    );

    const matchesRes = await fetch(`${BASE_URL}/matches`);
    const matchesData = await matchesRes.json();
    assert(matchesRes.status === 200 && matchesData.success === true, 'GET /api/matches returns 200');
    assert(matchesData.count === 1, 'Matches count equals 1');
    assert(matchesData.data[0].profile.id === 2, 'Matches list contains reciprocal match profile');
    assert(
      !matchesData.data.some((m) => m.profile.id === 3 || m.profile.id === 4),
      'Matches list excludes passed and one-sided liked profiles'
    );

    seedDatabase({ reset: true });

    const cleanFeedRes = await fetch(`${BASE_URL}/feed`);
    const cleanFeedData = await cleanFeedRes.json();
    assert(cleanFeedData.count === 32, 'Database reset restores feed count to 32');

    console.log(`\n  Tests: ${passed} passed, ${failed} failed (${passed + failed} total)\n`);
    return failed === 0;
  } catch (err) {
    console.error('API test runner error:', err);
    return false;
  }
}

if (require.main === module) {
  runApiTests().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runApiTests;
