const BASE_URL = 'http://localhost:5001/api';
const { seedDatabase } = require('../database/seed');
const db = require('../database/connection');

async function runEdgeCaseTests() {
  console.log('===============================================================');
  console.log('     STAGE 7: COMPREHENSIVE END-TO-END & EDGE-CASE TESTING    ');
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
    // Reset DB for pristine test run
    seedDatabase({ reset: true });

    // 1. Initial State Checks
    console.log('\n--- 1. Initial States ---');
    const initialFeed = await (await fetch(`${BASE_URL}/feed`)).json();
    assert(initialFeed.count === 32, `Feed has exactly 32 candidate profiles (Received: ${initialFeed.count})`);

    const initialMatches = await (await fetch(`${BASE_URL}/matches`)).json();
    assert(initialMatches.count === 0 && initialMatches.data.length === 0, 'Initial matches list is empty ([])');

    // 2. Input Validation Edge Cases
    console.log('\n--- 2. Input Validation Edge Cases ---');

    // Invalid action: "SUPERLIKE"
    const invActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'SUPERLIKE' }),
    });
    assert(invActionRes.status === 400, 'Invalid action "SUPERLIKE" rejected with 400 Bad Request');

    // Invalid action: empty string
    const emptyActionRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: '' }),
    });
    assert(emptyActionRes.status === 400, 'Empty action rejected with 400 Bad Request');

    // Invalid profileId: non-numeric string
    const stringIdRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 'abc_invalid', action: 'LIKE' }),
    });
    assert(stringIdRes.status === 400, 'Non-numeric profileId rejected with 400 Bad Request');

    // Invalid profileId: missing profileId
    const missingIdRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LIKE' }),
    });
    assert(missingIdRes.status === 400, 'Missing profileId rejected with 400 Bad Request');

    // Swiping on oneself (demo user ID 1)
    const selfSwipeRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 1, action: 'LIKE' }),
    });
    assert(selfSwipeRes.status === 400, 'Swiping on self (ID 1) rejected with 400 Bad Request');

    // Swiping on non-existent profile (ID 99999)
    const nonExistentRes = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 99999, action: 'PASS' }),
    });
    assert(nonExistentRes.status === 404, 'Swiping on non-existent profile (ID 99999) returns 404 Not Found');

    // 3. Repeated Swipes
    console.log('\n--- 3. Repeated Swipes ---');
    // First PASS on Profile 5
    const pass1 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'PASS' }),
    });
    assert(pass1.status === 200, 'First PASS on Profile 5 succeeds with 200 OK');

    // Repeated PASS on Profile 5
    const pass2 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 5, action: 'PASS' }),
    });
    assert(pass2.status === 409, 'Repeated PASS on Profile 5 rejected with 409 Conflict');

    // First LIKE on Profile 6
    const like1 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'LIKE' }),
    });
    assert(like1.status === 200, 'First LIKE on Profile 6 succeeds with 200 OK');

    // Repeated LIKE on Profile 6
    const like2 = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'LIKE' }),
    });
    assert(like2.status === 409, 'Repeated LIKE on Profile 6 rejected with 409 Conflict');

    // Attempting PASS after LIKE on Profile 6
    const passAfterLike = await fetch(`${BASE_URL}/swipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: 6, action: 'PASS' }),
    });
    assert(passAfterLike.status === 409, 'Attempting PASS after LIKE on Profile 6 rejected with 409 Conflict');

    // 4. Concurrency & Race Condition Handling
    console.log('\n--- 4. Concurrency & Race Condition Handling ---');
    // Fire 6 simultaneous concurrent swipes for Profile 7
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

    assert(successCount === 1, `Exactly 1 concurrent request succeeded (200 OK) (Count: ${successCount})`);
    assert(conflictCount === 5, `Remaining 5 concurrent requests returned 409 Conflict (Count: ${conflictCount})`);

    // Verify database has exactly 1 swipe record for (swiper: 1, swiped: 7)
    const dbSwipeCount = db.prepare('SELECT COUNT(*) as c FROM swipes WHERE swiper_id = 1 AND swiped_id = 7').get().c;
    assert(dbSwipeCount === 1, `Database holds exactly 1 swipe record for Profile 7 (Count: ${dbSwipeCount})`);

    // 5. Mutual Match Flow
    console.log('\n--- 5. Mutual Match Flow ---');
    // Profile 2 (Maya Lin) pre-liked demo user
    const matchSwipe = await (
      await fetch(`${BASE_URL}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: 2, action: 'LIKE' }),
      })
    ).json();
    assert(matchSwipe.isMatch === true, 'Mutual like on Profile 2 returned isMatch: true');
    assert(matchSwipe.match && matchSwipe.match.profile.name === 'Maya Lin', 'Mutual match returns Maya Lin');

    // 6. Persistence Verification
    console.log('\n--- 6. Persistence Verification ---');
    const matchesAfter = await (await fetch(`${BASE_URL}/matches`)).json();
    assert(matchesAfter.count === 1, `Matches count is 1 (Received: ${matchesAfter.count})`);

    // Verify profiles 5, 6, 7, 2 are all absent from feed
    const feedAfter = await (await fetch(`${BASE_URL}/feed`)).json();
    const swipedIds = [2, 5, 6, 7];
    const anySwipedInFeed = feedAfter.data.some((p) => swipedIds.includes(p.id));
    assert(!anySwipedInFeed, 'Swiped profiles (2, 5, 6, 7) are completely absent from feed');
    assert(feedAfter.count === 28, `Feed count decremented to 28 (Received: ${feedAfter.count})`);

    // 7. Reset DB to pristine demo state for presentation
    console.log('\n[Teardown] Restoring clean demo state...');
    seedDatabase({ reset: true });

    console.log('\n===============================================================');
    console.log(`TOTAL EDGE-CASE TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('===============================================================\n');

    return failed === 0;
  } catch (err) {
    console.error('Edge case test execution error:', err);
    return false;
  }
}

if (require.main === module) {
  runEdgeCaseTests().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runEdgeCaseTests;

