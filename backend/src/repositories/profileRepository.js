const db = require('../database/connection');

function getFeedProfiles(userId) {
  const stmt = db.prepare(`
    SELECT id, name, age, photo, bio, location, interests, created_at
    FROM profiles
    WHERE is_demo = 0
      AND id NOT IN (
        SELECT swiped_id FROM swipes WHERE swiper_id = ?
      )
    ORDER BY id ASC
  `);

  return stmt.all(userId).map((row) => ({
    ...row,
    interests: JSON.parse(row.interests || '[]'),
  }));
}

function getProfileById(profileId) {
  const row = db.prepare(`
    SELECT id, name, age, photo, bio, location, interests, is_demo, created_at
    FROM profiles
    WHERE id = ?
  `).get(profileId);

  if (!row) return null;

  return {
    ...row,
    interests: JSON.parse(row.interests || '[]'),
  };
}

module.exports = {
  getFeedProfiles,
  getProfileById,
};
