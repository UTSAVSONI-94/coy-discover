const db = require('../database/connection');

function createMatch(userA, userB) {
  const userOneId = Math.min(userA, userB);
  const userTwoId = Math.max(userA, userB);

  db.prepare(`
    INSERT INTO matches (user_one_id, user_two_id)
    VALUES (?, ?)
    ON CONFLICT(user_one_id, user_two_id) DO NOTHING
  `).run(userOneId, userTwoId);

  return db.prepare(`
    SELECT id, user_one_id, user_two_id, created_at
    FROM matches
    WHERE user_one_id = ? AND user_two_id = ?
  `).get(userOneId, userTwoId);
}

function getUserMatches(userId) {
  const rows = db.prepare(`
    SELECT
      m.id AS match_id,
      m.created_at AS matched_at,
      p.id,
      p.name,
      p.age,
      p.photo,
      p.bio,
      p.location,
      p.interests
    FROM matches m
    JOIN profiles p ON (
      CASE
        WHEN m.user_one_id = ? THEN m.user_two_id
        ELSE m.user_one_id
      END = p.id
    )
    WHERE m.user_one_id = ? OR m.user_two_id = ?
    ORDER BY m.created_at DESC
  `).all(userId, userId, userId);

  return rows.map((row) => ({
    matchId: row.match_id,
    matchedAt: row.matched_at,
    profile: {
      id: row.id,
      name: row.name,
      age: row.age,
      photo: row.photo,
      bio: row.bio,
      location: row.location,
      interests: JSON.parse(row.interests || '[]'),
    },
  }));
}

module.exports = {
  createMatch,
  getUserMatches,
};
