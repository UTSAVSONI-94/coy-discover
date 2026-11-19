const db = require('../database/connection');
const { DEMO_USER_ID, SWIPE_ACTIONS } = require('../config/constants');

function runVerification() {
  console.log('\nVerifying database schema & constraints...\n');
  let failures = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
    } else {
      console.error(`  ✕ ${testName}`);
      failures++;
    }
  }

  const candidateCount = db.prepare('SELECT COUNT(*) as count FROM profiles WHERE is_demo = 0').get().count;
  assert(candidateCount >= 30, `At least 30 candidate profiles exist (found ${candidateCount})`);

  const demoUser = db.prepare('SELECT * FROM profiles WHERE id = ? AND is_demo = 1').get(DEMO_USER_ID);
  assert(demoUser && demoUser.name === 'Alex Morgan', `Demo user exists with ID ${DEMO_USER_ID}`);

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
  assert(validProfiles, 'All profiles have required fields and at least 3 interests');

  const incomingLikes = db.prepare(
    'SELECT swiper_id FROM swipes WHERE swiped_id = ? AND action = ?'
  ).all(DEMO_USER_ID, SWIPE_ACTIONS.LIKE);
  assert(incomingLikes.length >= 5, `Incoming likes present for demo user (found ${incomingLikes.length})`);

  let swipeUniquePassed = false;
  try {
    db.prepare('INSERT INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)').run(2, 1, 'LIKE');
  } catch (err) {
    swipeUniquePassed = err.message.includes('UNIQUE constraint failed');
  }
  assert(swipeUniquePassed, 'Swipes table enforces UNIQUE(swiper_id, swiped_id)');

  let swipeActionCheckPassed = false;
  try {
    db.prepare('INSERT INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)').run(999, 1, 'INVALID');
  } catch (err) {
    swipeActionCheckPassed = err.message.includes('CHECK constraint failed');
  }
  assert(swipeActionCheckPassed, 'Swipes table enforces CHECK(action IN ("LIKE", "PASS"))');

  let matchesOrderingPassed = false;
  try {
    db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(5, 2);
  } catch (err) {
    matchesOrderingPassed = err.message.includes('CHECK constraint failed');
  }
  assert(matchesOrderingPassed, 'Matches table enforces CHECK(user_one_id < user_two_id)');

  let matchUniquePassed = false;
  db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(1, 2);
  try {
    db.prepare('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)').run(1, 2);
  } catch (err) {
    matchUniquePassed = err.message.includes('UNIQUE constraint failed');
  }
  assert(matchUniquePassed, 'Matches table enforces UNIQUE(user_one_id, user_two_id)');

  db.prepare('DELETE FROM matches WHERE user_one_id = 1 AND user_two_id = 2').run();

  console.log(`\n  Result: ${failures === 0 ? 'All checks passed' : `${failures} checks failed`}\n`);
  return failures === 0;
}

if (require.main === module) {
  const success = runVerification();
  process.exit(success ? 0 : 1);
}

module.exports = runVerification;
