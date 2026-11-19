const db = require('../database/connection');
const CONSTANTS = require('../config/constants');

/**
 * Repository for swipe data operations
 */
const swipeRepository = {
  /**
   * Find an existing swipe record between swiper and swiped profile.
   */
  findSwipe(swiperId, swipedId) {
    const stmt = db.prepare(`
      SELECT id, swiper_id, swiped_id, action, created_at
      FROM swipes
      WHERE swiper_id = ? AND swiped_id = ?
    `);
    return stmt.get(swiperId, swipedId);
  },

  /**
   * Check whether a user has swiped LIKE on a target user.
   */
  hasLikedUser(swiperId, targetUserId) {
    const stmt = db.prepare(`
      SELECT 1 FROM swipes
      WHERE swiper_id = ? AND swiped_id = ? AND action = ?
    `);
    const result = stmt.get(swiperId, targetUserId, CONSTANTS.SWIPE_ACTIONS.LIKE);
    return Boolean(result);
  },

  /**
   * Insert a new swipe record.
   */
  createSwipe(swiperId, swipedId, action) {
    const stmt = db.prepare(`
      INSERT INTO swipes (swiper_id, swiped_id, action)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(swiperId, swipedId, action);
    return {
      id: info.lastInsertRowid,
      swiper_id: swiperId,
      swiped_id: swipedId,
      action,
    };
  },
};

module.exports = swipeRepository;
