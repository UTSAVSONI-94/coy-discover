const db = require('../database/connection');
const CONSTANTS = require('../config/constants');

function runVerification() {
  console.log('--- Running Database & Schema Verification ---');
  let failures = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failures++;
    }
  }

  // 1. Total Profile Count
  const candidateCount = db.prepare('SELECT COUNT(*) as count FROM profiles WHERE is_demo = 0').get().count;
  assert(candidateCount >= 30, `At least 30 candidate profiles exist (Found: ${candidateCount})`);

  // 2. Demo User Exists
  const demoUser = db.prepare('SELECT * FROM profiles WHERE id = ? AND is_demo = 1').get(CONSTANTS.DEMO_USER_ID);
  assert(demoUser && demoUser.name === 'Alex Morgan', `Demo user exists with ID ${CONSTANTS.DEMO_USER_ID}`);

  // 3. All Profiles Have Valid Required Fields & >= 3 Interests
  const allProfiles = db.prepare('SELECT * FROM profiles').all();
  let validProfiles = true;
  for (const p of allProfiles) {
    if (!p.name || !p.age || !p.photo || !p.bio || !p.location || !p.interests || !p.created_at) {
      validProfiles = false;
      break;
    }
    const interests = JSON.parse(p.interests);
    if (!Array.isArray(interests) || interests.length < 3) {
      validProfiles = false;
      break;
    }
  }
  assert(validProfiles, 'All profiles have valid non-empty fields and >= 3 interests');

  // 4. Pre-existing Incoming Likes
  const incomingLikes = db.prepare(
    'SELECT swiper_id FROM swipes WHERE swiped_id = ? AND action = ?'
  ).all(CONSTANTS.DEMO_USER_ID, CONSTANTS.SWIPE_ACTIONS.LIKE);
  assert(incomingLikes.length >= 5, `Incoming likes present for demo user (Found: ${incomingLikes.length})`);

  // 5. Demo User Has Zero Outgoing Swipes Initially
  const outgoingSwipes = db.prepare(
    'SELECT COUNT(*) as count FROM swipes WHERE swiper_id = ?'
  ).get(CONSTANTS.DEMO_USER_ID).count;
  assert(outgoingSwipes === 0, `Demo user has zero outgoing swipes initially (Count: ${outgoingSwipes})`);

  // 6. Test Unique Constraint on Swipes (swiper_id, swiped_id)
  let swipeUniquePassed = false;
  try {
    // Attempt duplicate swipe of existing incoming like (swiper=2, swiped=1)
    db.prepare('INSERT INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)').run(2, 1, 'LIKE');
  } catch (err) {
    swipeUniquePassed = err.message.includes('UNIQUE constraint failed');
  }
  assert(swipeUniquePassed, 'Swipes table enforces UNIQUE(swiper_id, swiped_id)');

  // 7. Test Check Constraint on Swipes Action (Only LIKE or PASS allowed)
  let swipeActionCheckPassed = false;
  try {
    db.prepare('INSERT INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)').run(999, 1, 'SUPERLIKE');
  } catch (err) {
    swipeActionCheckPassed = err.message.includes('CHECK constraint failed');
  }
  assert(swipeActionCheckPassed, 'Swipes table enforces CHECK(action IN ("LIKE", "PASS"))');

  // 8. Test Matches Table Ordering and Uniqueness
  let matchesOrderingPassed = false;
  try {
    // Attempt invalid ordering (user_one_id = 5, user_two_id = 2 where 5 > 2)
    db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(5, 2);
  } catch (err) {
    matchesOrderingPassed = err.message.includes('CHECK constraint failed');
  }
  assert(matchesOrderingPassed, 'Matches table enforces CHECK(user_one_id < user_two_id)');

  // Test Valid Match insertion + Uniqueness
  let matchUniquePassed = false;
  db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(1, 2);
  try {
    // Duplicate match
    db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(1, 2);
  } catch (err) {
    matchUniquePassed = err.message.includes('UNIQUE constraint failed');
  }
  assert(matchUniquePassed, 'Matches table enforces UNIQUE(user_one_id, user_two_id)');

  // Clean up test match so state remains pristine
  db.prepare('DELETE FROM matches WHERE user_one_id = 1 AND user_two_id = 2').run();

  console.log(`--- Verification Complete: ${failures === 0 ? 'ALL PASSED' : `${failures} FAILURES`} ---`);
  return failures === 0;
}

if (require.main === module) {
  const success = runVerification();
  process.exit(success ? 0 : 1);
}

module.exports = runVerification;
