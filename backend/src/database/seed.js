const db = require('./connection');
const CONSTANTS = require('../config/constants');

const DEMO_USER = {
  id: CONSTANTS.DEMO_USER_ID,
  name: 'Alex Morgan',
  age: 22,
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  bio: 'Design student at NYU. Big on 35mm film, indie concerts, matcha lattes, and finding the best tacos in Brooklyn.',
  location: 'NYU / Brooklyn',
  interests: JSON.stringify(['Design', 'Film Photography', 'Live Music', 'Matcha', 'Art Galleries']),
  is_demo: 1,
};

const MOCK_PROFILES = [
  {
    id: 2,
    name: 'Maya Lin',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Architecture major. Always sketching buildings or hunting for vintage mid-century furniture.',
    location: 'Columbia University',
    interests: JSON.stringify(['Architecture', 'Thrifting', 'Sketching', 'Jazz']),
  },
  {
    id: 3,
    name: 'Lucas Silva',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer by day, bouldering enthusiast by night. Let me teach you how to send a V5.',
    location: 'Austin, TX',
    interests: JSON.stringify(['Bouldering', 'Podcasts', 'Craft Beer', 'Sci-Fi']),
  },
  {
    id: 4,
    name: 'Chloe Dubois',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Literature and philosophy geek. Will debate existentialism over an iced oat cortado.',
    location: 'Brown University',
    interests: JSON.stringify(['Classic Literature', 'Specialty Coffee', 'Philosophy', 'Poetry']),
  },
  {
    id: 5,
    name: 'Rohan Patel',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Bioengineering grad student. Marathon trainee and amateur sourdough baker.',
    location: 'Stanford University',
    interests: JSON.stringify(['Running', 'Baking', 'Board Games', 'Neuroscience']),
  },
  {
    id: 6,
    name: 'Sofia Gomez',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Visual arts & ceramics. My apartment looks like a botanical garden with a clay studio inside.',
    location: 'RISD / Providence',
    interests: JSON.stringify(['Ceramics', 'Houseplants', 'Printmaking', 'Indie Rock']),
  },
  {
    id: 7,
    name: 'Marcus Vance',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Music production student. Collecting vinyl, synthesizing beats, and looking for a concert buddy.',
    location: 'Berklee College of Music',
    interests: JSON.stringify(['Vinyl', 'Music Production', 'Guitar', 'Sneakers']),
  },
  {
    id: 8,
    name: 'Aria Sharma',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Cognitive Science & UX. Incurable curiosity for human behavior and thrift shop jackets.',
    location: 'UC Berkeley',
    interests: JSON.stringify(['UI/UX', 'Thrifting', 'Boba', 'Hiking']),
  },
  {
    id: 9,
    name: 'Daniel Kim',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Product manager & amateur chef. I make homemade pasta from scratch every Sunday.',
    location: 'Seattle, WA',
    interests: JSON.stringify(['Cooking', 'Italian Food', 'Cycling', 'Travel Photography']),
  },
  {
    id: 10,
    name: 'Emma Watson',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Environmental science major. Camping, film photography, and saving bees.',
    location: 'University of Washington',
    interests: JSON.stringify(['Hiking', 'Sustainability', 'Camping', 'Film Photography']),
  },
  {
    id: 11,
    name: 'Jordan Rivera',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Freelance illustrator and cafe hopper. Tell me your top 3 comfort movies.',
    location: 'Chicago, IL',
    interests: JSON.stringify(['Illustration', 'Cinema', 'Anime', 'Matcha']),
  },
  {
    id: 12,
    name: 'Zara Chen',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Journalism senior. High energy, loves rooftop conversations, spicy ramen, and city walks.',
    location: 'Northwestern University',
    interests: JSON.stringify(['Journalism', 'Ramen', 'City Walks', 'Street Photography']),
  },
  {
    id: 13,
    name: 'Noah Bennett',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Finance analyst trying to spend more time outdoors than at a spreadsheet.',
    location: 'Boston, MA',
    interests: JSON.stringify(['Skiing', 'Tennis', 'Mixology', 'Travel']),
  },
  {
    id: 14,
    name: 'Elena Rostova',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Classical violin & contemporary dance. Looking for someone who appreciates spontaneous museum trips.',
    location: 'Juilliard / NYC',
    interests: JSON.stringify(['Violin', 'Dance', 'Museums', 'French Cinema']),
  },
  {
    id: 15,
    name: 'Kai Takahashi',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Industrial design student. Designing minimal everyday objects and brewing pour-overs.',
    location: 'Carnegie Mellon',
    interests: JSON.stringify(['Industrial Design', 'Pour Over', 'Minimalism', 'Typography']),
  },
  {
    id: 16,
    name: 'Amara Okafor',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    bio: 'Pre-law student passionate about civil rights and debate. Also an undercover karaoke queen.',
    location: 'Georgetown University',
    interests: JSON.stringify(['Debate', 'Karaoke', 'Podcasts', 'Afrobeats']),
  },
  {
    id: 17,
    name: 'Liam O’Connor',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Oceanography student & surfer. Best days start with dawn patrol and end around a beach bonfire.',
    location: 'UC San Diego',
    interests: JSON.stringify(['Surfing', 'Marine Biology', 'Acoustic Guitar', 'Beach Volleyball']),
  },
  {
    id: 18,
    name: 'Priya Nair',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Economics & statistics. I will beat you at Catan and chess, but I will buy you ice cream after.',
    location: 'University of Michigan',
    interests: JSON.stringify(['Board Games', 'Chess', 'Data Science', 'Ice Cream']),
  },
  {
    id: 19,
    name: 'Leo Rossi',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'History nerd and aspiring documentary filmmaker. Let us go explore antique bookstores.',
    location: 'UCLA',
    interests: JSON.stringify(['Documentaries', 'Antiques', 'History', 'Screenwriting']),
  },
  {
    id: 20,
    name: 'Zoe Kravitz',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion merchandising student. Living in oversized blazers and high tops.',
    location: 'FIT / NYC',
    interests: JSON.stringify(['Fashion', 'Streetwear', 'Photography', 'Matcha']),
  },
  {
    id: 21,
    name: 'Tariq Al-Mansoor',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Civil engineering grad. Passionate about green architecture and sustainable cities.',
    location: 'Toronto / Ryerson',
    interests: JSON.stringify(['Urban Planning', 'Soccer', 'Cycling', 'Middle Eastern Food']),
  },
  {
    id: 22,
    name: 'Isla MacDonald',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    bio: 'Veterinary medicine student. If you have a dog, they are 100% invited to our first date.',
    location: 'Cornell University',
    interests: JSON.stringify(['Animals', 'Equestrian', 'Hiking', 'Coffee']),
  },
  {
    id: 23,
    name: 'Mateo Hernandez',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Photographer & graphic designer. Scouting brutalist architecture and drinking espresso.',
    location: 'Miami, FL',
    interests: JSON.stringify(['Street Art', 'Espresso', 'Brutalism', 'Vinyl']),
  },
  {
    id: 24,
    name: 'Hannah Abbott',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Psychology student. Avid podcast listener and plants enthusiast with 40+ succulents.',
    location: 'UNC Chapel Hill',
    interests: JSON.stringify(['Psychology', 'Succulents', 'True Crime', 'Pilates']),
  },
  {
    id: 25,
    name: 'Caleb Wright',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Aerospace engineering senior. Building model rockets and stargazing on clear desert nights.',
    location: 'CU Boulder',
    interests: JSON.stringify(['Astronomy', 'Rock Climbing', 'Camping', 'Rockets']),
  },
  {
    id: 26,
    name: 'Nadia Volkova',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Computer science & linguistics. NLP research, indie games, and mechanical keyboards.',
    location: 'MIT / Cambridge',
    interests: JSON.stringify(['Linguistics', 'Keyboards', 'Indie Games', 'Boba']),
  },
  {
    id: 27,
    name: 'Samir Joshi',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Medical student. Surviving on dark roast coffee, runs along the river, and dry humor.',
    location: 'Johns Hopkins',
    interests: JSON.stringify(['Running', 'Medicine', 'Cooking', 'Stand-up Comedy']),
  },
  {
    id: 28,
    name: 'Ruby Taylor',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'Drama & theater arts. I will quiz you on Broadway trivia and convince you to watch musicals.',
    location: 'NYU Tisch',
    interests: JSON.stringify(['Theater', 'Acting', 'Playwriting', 'Vintage Flea Markets']),
  },
  {
    id: 29,
    name: 'Felix Moreau',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Culinary arts graduate working in pastry. Yes, I will make you fresh croissants.',
    location: 'Montreal / McGill',
    interests: JSON.stringify(['Pastry', 'French Cooking', 'Wine Tasting', 'Cycling']),
  },
  {
    id: 30,
    name: 'Grace Kim',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Marketing & communications. Always planning the next road trip playlist and flea market haul.',
    location: 'Emory University / Atlanta',
    interests: JSON.stringify(['Road Trips', 'Thrifting', 'Podcasts', 'Matcha']),
  },
  {
    id: 31,
    name: 'Ethan Brooks',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Kinesiology student & personal trainer. Active life, good vibes, and healthy meal preps.',
    location: 'UT Austin',
    interests: JSON.stringify(['Fitness', 'Calisthenics', 'Nutritional Science', 'Dogs']),
  },
  {
    id: 32,
    name: 'Olivia Martinez',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    bio: 'Film studies major. Looking for someone to sit in the front row of cinema revival houses with.',
    location: 'USC Cinema Arts',
    interests: JSON.stringify(['Film', 'Directing', 'Screenwriting', 'Analog Synths']),
  },
  {
    id: 33,
    name: 'Zachary Cole',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    bio: 'Game design student. Level designer, pixel art creator, and collector of retro handhelds.',
    location: 'RIT / Rochester',
    interests: JSON.stringify(['Game Design', 'Pixel Art', 'Synthesizers', 'Sci-Fi Books']),
  },
];

// Curated list of candidate profile IDs that have pre-liked the demo user
const PRE_EXISTING_LIKER_IDS = [2, 5, 8, 12, 16, 20, 24, 30];

/**
 * Seed the database with demo user, candidates, and pre-existing incoming likes.
 * Uses SQLite transaction and INSERT OR REPLACE / INSERT OR IGNORE for idempotency.
 */
function seedDatabase() {
  console.log('[Seed] Starting database seeding...');

  const insertProfileStmt = db.prepare(`
    INSERT INTO profiles (id, name, age, photo, bio, location, interests, is_demo)
    VALUES (@id, @name, @age, @photo, @bio, @location, @interests, @is_demo)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      age = excluded.age,
      photo = excluded.photo,
      bio = excluded.bio,
      location = excluded.location,
      interests = excluded.interests,
      is_demo = excluded.is_demo
  `);

  const insertSwipeStmt = db.prepare(`
    INSERT OR IGNORE INTO swipes (swiper_id, swiped_id, action)
    VALUES (?, ?, ?)
  `);

  const runSeeding = db.transaction(() => {
    // 1. Seed Demo User
    insertProfileStmt.run(DEMO_USER);

    // 2. Seed Mock Candidates
    for (const profile of MOCK_PROFILES) {
      insertProfileStmt.run({
        ...profile,
        is_demo: 0,
      });
    }

    // 3. Seed Incoming Likes on Demo User (swiper = candidate, swiped = DEMO_USER_ID, action = LIKE)
    for (const likerId of PRE_EXISTING_LIKER_IDS) {
      insertSwipeStmt.run(likerId, CONSTANTS.DEMO_USER_ID, CONSTANTS.SWIPE_ACTIONS.LIKE);
    }
  });

  runSeeding();

  // Summary counts
  const profileCount = db.prepare('SELECT COUNT(*) as count FROM profiles').get().count;
  const candidateCount = db.prepare('SELECT COUNT(*) as count FROM profiles WHERE is_demo = 0').get().count;
  const incomingLikesCount = db.prepare('SELECT COUNT(*) as count FROM swipes WHERE swiped_id = ? AND action = ?').get(
    CONSTANTS.DEMO_USER_ID,
    CONSTANTS.SWIPE_ACTIONS.LIKE
  ).count;
  const matchesCount = db.prepare('SELECT COUNT(*) as count FROM matches').get().count;

  console.log(`[Seed] Seeding completed successfully!`);
  console.log(`  - Total Profiles: ${profileCount} (1 Demo User + ${candidateCount} Candidates)`);
  console.log(`  - Pre-existing Incoming Likes on Demo User: ${incomingLikesCount} (Candidates: [${PRE_EXISTING_LIKER_IDS.join(', ')}])`);
  console.log(`  - Initial Mutual Matches: ${matchesCount}`);

  return {
    profileCount,
    candidateCount,
    incomingLikesCount,
    matchesCount,
  };
}

// Run immediately if called directly via CLI
if (require.main === module) {
  try {
    seedDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

module.exports = { seedDatabase, DEMO_USER, MOCK_PROFILES, PRE_EXISTING_LIKER_IDS };
