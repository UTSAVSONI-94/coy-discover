const BASE_URL = 'http://localhost:5001/api';
const { seedDatabase } = require('../database/seed');
const db = require('../database/connection');

async function runEdgeCaseTests() {
  console.log('\nRunning edge-case & concurrency tests...\n');
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
    const initialFeed = await (await fetch(`${BASE_URL}/feed`)).json();
    assert(initialFeed.count === 32, 'Initial feed has 32 candidate profiles');

    const initialMatches = await (await fetch(`${BASE_URL}/matches`)).json();
    assert(initialMatches.count === 0, 'Initial matches list is empty');

    const invActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'SUPERLIKE' }),
    });
    assert(invActionRes.status === 400, 'Invalid action SUPERLIKE returns 400');

    const emptyActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: '' }),
    });
    assert(emptyActionRes.status === 400, 'Empty action returns 400');

    const stringIdRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 'invalid_id', action: 'LIKE' }),
    });
    assert(stringIdRes.status === 400, 'Non-numeric profileId returns 400');

    const missingIdRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LIKE' }),
    });
    assert(missingIdRes.status === 400, 'Missing profileId returns 400');

    const selfSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 1, action: 'LIKE' }),
    });
    assert(selfSwipeRes.status === 400, 'Swiping on self (ID 1) returns 400');

    const nonExistentRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 99999, action: 'PASS' }),
    });
    assert(nonExistentRes.status === 404, 'Non-existent profile returns 404');

    const pass1 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'PASS' }),
    });
    assert(pass1.status === 200, 'First PASS on Profile 5 returns 200');

    const pass2 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'PASS' }),
    });
    assert(pass2.status === 409, 'Repeated PASS on Profile 5 returns 409 Conflict');

    const like1 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'LIKE' }),
    });
    assert(like1.status === 200, 'First LIKE on Profile 6 returns 200');

    const like2 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'LIKE' }),
    });
    assert(like2.status === 409, 'Repeated LIKE on Profile 6 returns 409 Conflict');

    const passAfterLike = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'PASS' }),
    });
    assert(passAfterLike.status === 409, 'PASS after LIKE on Profile 6 returns 409 Conflict');

    // Concurrency check
    const concurrentRequests = Array.from({ length: 6 }).map(() =>
      fetch(`${BASE_URL}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: 7, action: 'LIKE' }),
      })
    );
    const concurrentResponses = await Promise.all(concurrentRequests);
    const successCount = concurrentResponses.filter((r) => r.status === 200).length;
    const conflictCount = concurrentResponses.filter((r) => r.status === 409).length;

    assert(successCount === 1, 'Exactly 1 concurrent swipe succeeds (200)');
    assert(conflictCount === 5, 'Remaining 5 concurrent swipes return 409 Conflict');

    const dbSwipeCount = db.prepare('SELECT COUNT(*) as c FROM swipes WHERE swiper_id = 1 AND swiped_id = 7').get().c;
    assert(dbSwipeCount === 1, 'Database contains exactly 1 swipe record for Profile 7');

    const matchSwipe = await (
      await fetch(`${BASE_URL}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
      })
    ).json();
    assert(matchSwipe.isMatch === true, 'Mutual like on Profile 2 returns isMatch: true');
    assert(matchSwipe.match && matchSwipe.match.profile.name === 'Maya Lin', 'Mutual match payload contains profile name');

    const matchesAfter = await (await fetch(`${BASE_URL}/matches`)).json();
    assert(matchesAfter.count === 1, 'Matches count equals 1');

    const feedAfter = await (await fetch(`${BASE_URL}/feed`)).json();
    const swipedIds = [2, 5, 6, 7];
    const anySwipedInFeed = feedAfter.data.some((p) => swipedIds.includes(p.id));
    assert(!anySwipedInFeed, 'Swiped profiles (2, 5, 6, 7) are absent from feed');
    assert(feedAfter.count === 28, 'Feed count decremented to 28');

    seedDatabase({ reset: true });

    console.log(`\n  Tests: ${passed} passed, ${failed} failed (${passed + failed} total)\n`);
    return failed === 0;
  } catch (err) {
    console.error('Edge case test runner error:', err);
    return false;
  }
}

if (require.main === module) {
  runEdgeCaseTests().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runEdgeCaseTests;
