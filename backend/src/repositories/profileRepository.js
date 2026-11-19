const db = require('../database/connection');

/**
 * Repository for profile data operations
 */
const profileRepository = {
  /**
   * Fetch profiles that the user has not swiped on yet.
   * Strictly excludes is_demo profiles and any profile swiped by userId.
   * Deliberately omits any join or flag regarding incoming likes to enforce privacy.
   */
  getFeedProfiles(userId) {
    const stmt = db.prepare(`
      SELECT
        id,
        name,
        age,
        photo,
        bio,
        location,
        interests,
        created_at
      FROM profiles
      WHERE is_demo = 0
        AND id NOT IN (
          SELECT swiped_id FROM swipes WHERE swiper_id = ?
        )
      ORDER BY id ASC
    `);

    const rows = stmt.all(userId);
    return rows.map((row) => ({
      ...row,
      interests: JSON.parse(row.interests || '[]'),
    }));
  },

  /**
   * Fetch a single profile by ID.
   */
  getProfileById(profileId) {
    const stmt = db.prepare(`
      SELECT
        id,
        name,
        age,
        photo,
        bio,
        location,
        interests,
        is_demo,
        created_at
      FROM profiles
      WHERE id = ?
    `);

    const row = stmt.get(profileId);
    if (!row) return null;

    return {
      ...row,
      interests: JSON.parse(row.interests || '[]'),
    };
  },
};

module.exports = profileRepository;

