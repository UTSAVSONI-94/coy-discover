const db = require('../database/connection');
const { SWIPE_ACTIONS } = require('../config/constants');

function findSwipe(swiperId, swipedId) {
  return db.prepare(`
    SELECT id, swiper_id, swiped_id, action, created_at
    FROM swipes
    WHERE swiper_id = ? AND swiped_id = ?
  `).get(swiperId, swipedId);
}

function hasLikedUser(swiperId, targetUserId) {
  const row = db.prepare(`
    SELECT 1 FROM swipes
    WHERE swiper_id = ? AND swiped_id = ? AND action = ?
  `).get(swiperId, targetUserId, SWIPE_ACTIONS.LIKE);

  return Boolean(row);
}

function createSwipe(swiperId, swipedId, action) {
  const info = db.prepare(`
    INSERT INTO swipes (swiper_id, swiped_id, action)
    VALUES (?, ?, ?)
  `).run(swiperId, swipedId, action);

  return {
    id: info.lastInsertRowid,
    swiper_id: swiperId,
    swiped_id: swipedId,
    action,
  };
}

module.exports = {
  findSwipe,
  hasLikedUser,
  createSwipe,
};
