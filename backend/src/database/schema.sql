-- Enable Foreign Key constraints
PRAGMA foreign_keys = ON;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  photo TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT NOT NULL,
  is_demo INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Swipes Table
CREATE TABLE IF NOT EXISTS swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  swiper_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, swiped_id)
);

-- Index for fast lookup on unswiped feed and reciprocal swipe checks
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_reciprocal ON swipes(swiper_id, swiped_id, action);

-- 3. Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_one_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_two_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK(user_one_id < user_two_id),
  UNIQUE(user_one_id, user_two_id)
);

-- Index for fast lookup on user matches
CREATE INDEX IF NOT EXISTS idx_matches_user_one ON matches(user_one_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_two ON matches(user_two_id);
