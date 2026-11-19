# Coy — Discover Tab (SDE Intern Assignment)

A standalone mobile-first profile discovery, swipe, and mutual matching application built for the **Coy SDE Intern Assignment (Part B)**.

![Coy Discover Banner](https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&h=400&q=80)

---

## 1. Overview & Objective

This repository contains an end-to-end implementation of the swipe-based **Discover** feature alongside Coy's existing experience. The application replicates the core consumer discovery paradigm (card swipes, gesture physics, instant match celebrations, and mutual matches list) while strictly enforcing **Coy's Core Privacy Promise**: **incoming likes remain 100% confidential and are never revealed unless mutual interest is established**.

Per the assignment specification:
* **Home Tab**: Maintained as a clean placeholder.
* **Discover Tab**: The active standalone application containing profile discovery, touch/mouse card swiping, and mutual matches.

---

## 2. Key Features

* **Mobile-First Responsive UI**: Styled with Tailwind CSS, custom design tokens, and viewport optimization for mobile touch devices, tablets, and desktop displays.
* **Fluid Framer Motion Swiping**:
  * Touch and mouse drag physics with elastic resistance.
  * Card tilt and rotation proportional to horizontal drag distance.
  * Real-time dynamic visual feedback: green **LIKE** badge on right drag, red **PASS** badge on left drag.
  * Incomplete drags (`|offset| < 100px`) smoothly spring back to the center without triggering an API request.
  * Desktop action buttons (Pass & Like) with smooth directional fly-out animations.
* **Atomic Mutual Matching & Celebration**:
  * Celebratory *"It's a Match!"* modal overlay triggered immediately upon a reciprocal like.
  * Matched person's photograph, name, and confirmation badge with zero messaging bloat.
* **Zero-Leakage Privacy Architecture**:
  * The discovery feed API (`GET /api/feed`) never exposes incoming likes or swipe metadata.
  * Candidates who already liked the demo user look completely identical to those who haven't.
  * One-sided likes never trigger notifications and never appear in the Matches view.
* **Persistent SQLite Database**:
  * Stored on disk using `better-sqlite3` with Write-Ahead Logging (WAL) and foreign key integrity.
  * Swipes, matches, and profile exclusions persist permanently across browser reloads and server restarts.
* **Resilient Concurrency & Offline Fallbacks**:
  * Double-submission locks preventing rapid-fire clicks.
  * Database transaction conflict handling (`409 Conflict`) for concurrent swipe attempts.
  * Offline-ready inline SVG avatar fallback when external image sources are slow or unreachable.

---

## 3. Technology Stack

### **Frontend**
* **React.js 18** — Component architecture and declarative UI state.
* **Vite 6** — Lightning-fast development server and optimized production bundler.
* **Tailwind CSS 3** — Utility-first styling with custom dark-mode Coy color tokens.
* **Framer Motion 11** — Native-feel drag gestures, spring physics, and card exit/entry transitions.
* **Lucide React** — Minimalist SVG iconography.

### **Backend**
* **Node.js** — JavaScript runtime environment.
* **Express.js 4** — RESTful API routing, JSON body parsing, CORS middleware, and error handling.
* **better-sqlite3 11** — High-performance, synchronous SQLite driver with WAL mode and foreign key enforcement.
* **dotenv** — Environment configuration management.

---

## 4. Project Architecture & Directory Structure

The project enforces strict separation of concerns between backend business logic and frontend presentation:

```text
Coy/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js          # DEMO_USER_ID, SWIPE_ACTIONS
│   │   │   └── env.js                # Environment configuration loader
│   │   ├── controllers/
│   │   │   ├── feedController.js     # GET /api/feed handler
│   │   │   ├── healthController.js   # GET /api/health handler
│   │   │   ├── matchController.js    # GET /api/matches handler
│   │   │   └── swipeController.js    # POST /api/swipe handler
│   │   ├── database/
│   │   │   ├── connection.js         # SQLite connection manager (better-sqlite3)
│   │   │   ├── schema.sql            # Table definitions, constraints, and indexes
│   │   │   └── seed.js               # Idempotent seeding script (32 profiles + 8 incoming likes)
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Centralized sanitized JSON error handler
│   │   ├── repositories/
│   │   │   ├── matchRepository.js    # SQL queries for mutual matches
│   │   │   ├── profileRepository.js  # SQL queries for candidate profiles & unswiped feed
│   │   │   └── swipeRepository.js    # SQL queries for swipe records & reciprocal checks
│   │   ├── routes/
│   │   │   ├── feedRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── matchRoutes.js
│   │   │   └── swipeRoutes.js
│   │   ├── services/
│   │   │   ├── feedService.js        # Feed aggregation business logic
│   │   │   ├── matchService.js       # Matches business logic
│   │   │   └── swipeService.js       # Transactional swipe & mutual match resolution
│   │   └── utils/
│   │       ├── e2eEdgeCaseTests.js   # 21 automated edge-case & concurrency tests
│   │       ├── testApis.js           # 22 integration tests for API endpoints
│   │       ├── verifyDb.js           # Schema & constraint integrity verification
│   │       └── verifyScenarios.js    # Scenarios A, B, C, D acceptance verification
│   ├── package.json
│   ├── server.js                     # Express application entrypoint
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionButtons.jsx     # Pass (X) and Like (Heart) trigger buttons
│   │   │   ├── EmptyFeedState.jsx    # Caught-up state with feed refresh button
│   │   │   ├── ErrorState.jsx        # Resilient error card with retry action
│   │   │   ├── HomePlaceholder.jsx   # Assignment-mandated blank Home placeholder
│   │   │   ├── LoadingSkeleton.jsx   # Card loading skeleton shimmer
│   │   │   ├── MatchCelebrationModal.jsx # "It's a Match!" celebration modal overlay
│   │   │   ├── MatchesView.jsx       # Grid view of mutual matches with timestamps
│   │   │   ├── Navigation.jsx        # Bottom tab bar (mobile) & header navigation
│   │   │   ├── ProfileCard.jsx       # Portrait card presentation with tags
│   │   │   └── SwipeableCard.jsx     # Framer Motion drag gestures, rotation, & badges
│   │   ├── pages/
│   │   │   └── DiscoverPage.jsx      # Discover coordinator managing cards and matches
│   │   ├── services/
│   │   │   └── api.js                # Centralized fetch client for backend endpoints
│   │   ├── styles/
│   │   │   └── index.css             # Tailwind directives & viewport styles
│   │   ├── utils/
│   │   │   └── imageFallback.js      # Zero-network SVG avatar fallback
│   │   ├── App.jsx                   # Root layout managing primary tabs
│   │   └── main.jsx                  # React application mount
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore                        # Comprehensive ignore rules (DB, node_modules, env)
└── README.md
```

---

## 5. Database Schema & Design

The SQLite database (`coy.db`) enforces relational integrity via three normalized tables:

### 1. `profiles`
Stores all discoverable candidates as well as the predefined demo user.
```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  photo TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT NOT NULL,       -- JSON-encoded array of strings
  is_demo INTEGER DEFAULT 0,     -- 1 for demo user (id: 1), 0 for candidates
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `swipes`
Tracks every like or pass action.
```sql
CREATE TABLE swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  swiper_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, swiped_id)  -- Prevents duplicate swipes on the same profile
);
```

### 3. `matches`
Stores confirmed reciprocal mutual likes.
```sql
CREATE TABLE matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_one_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_two_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK(user_one_id < user_two_id),       -- Canonical ID ordering
  UNIQUE(user_one_id, user_two_id)        -- Eliminates duplicate reciprocal match rows
);
```

---

## 6. API Documentation

Base URL: `http://localhost:5001/api`

### `GET /api/feed`
Retrieves unswiped candidate profiles for the demo user (`id: 1`).
* **Request**: None.
* **Privacy**: Does not join or expose incoming likes.
* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 32,
  "data": [
    {
      "id": 2,
      "name": "Maya Lin",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture major. Vintage mid-century hunter.",
      "location": "Columbia University",
      "interests": ["Architecture", "Thrifting", "Sketching", "Jazz"],
      "created_at": "2026-11-19 10:04:12"
    }
  ]
}
```

### `POST /api/swipe`
Records a swipe action (`LIKE` or `PASS`) and resolves mutual matching inside an atomic transaction.
* **Request Body**:
```json
{
  "profileId": 2,
  "action": "LIKE"
}
```
* **Response — Mutual Match (200 OK)**:
```json
{
  "success": true,
  "action": "LIKE",
  "isMatch": true,
  "match": {
    "id": 1,
    "profile": {
      "id": 2,
      "name": "Maya Lin",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture major. Vintage mid-century hunter.",
      "location": "Columbia University",
      "interests": ["Architecture", "Thrifting", "Sketching", "Jazz"]
    }
  }
}
```
* **Response — Non-Match or Pass (200 OK)**:
```json
{
  "success": true,
  "action": "PASS",
  "isMatch": false
}
```
* **Error Responses**:
  * `400 Bad Request`: Missing fields, self-swipe, or invalid action.
  * `404 Not Found`: Target profile does not exist.
  * `409 Conflict`: Target profile has already been swiped on.

### `GET /api/matches`
Retrieves all confirmed mutual matches for the demo user.
* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "matchId": 1,
      "matchedAt": "2026-11-19 10:25:01",
      "profile": {
        "id": 2,
        "name": "Maya Lin",
        "age": 21,
        "photo": "https://images.unsplash.com/...",
        "bio": "Architecture major. Vintage mid-century hunter.",
        "location": "Columbia University",
        "interests": ["Architecture", "Thrifting", "Sketching", "Jazz"]
      }
    }
  ]
}
```

### `GET /api/health`
Health check endpoint. Returns `200 OK` with status and UTC timestamp.

---

## 7. Matching Algorithm & Privacy Implementation

1. **Deterministic Mutual Evaluation**:
   When the demo user (`id: 1`) swipes `LIKE` on candidate `X`:
   ```sql
   SELECT 1 FROM swipes 
   WHERE swiper_id = X AND swiped_id = 1 AND action = 'LIKE';
   ```
   * If a record exists, both users have liked each other: a row is atomically written to `matches` and `isMatch: true` is returned.
   * If no reciprocal like exists, the like is stored quietly in `swipes`, and `isMatch: false` is returned.
2. **Coy's Discretion Guarantee**:
   * The candidate feed query uses a pure exclusion model (`WHERE id NOT IN (SELECT swiped_id FROM swipes WHERE swiper_id = 1)`).
   * Inspection of network traffic reveals zero clues about who liked the user.
   * One-sided incoming likes remain completely invisible until the demo user independently likes that profile back.

---

## 8. Installation & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher (tested on Node v24.5.0)
* **npm**: v9.0.0 or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/coy-discover.git
cd coy-discover
```

### Step 2: Configure Environment Variables
Copy the example environment files (defaults are preconfigured for local dev):
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

* `backend/.env`:
  ```env
  PORT=5001
  CORS_ORIGIN=http://localhost:5173
  DB_PATH=src/database/coy.db
  NODE_ENV=development
  ```
* `frontend/.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:5001/api
  ```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### Step 4: Initialize & Seed the Database
```bash
cd backend
npm run seed
cd ..
```
* Populates 32 diverse candidate profiles (`id: 2–33`) and 1 Demo User (`id: 1`).
* Pre-seeds 8 incoming likes on the demo user from profiles: `[2, 5, 8, 12, 16, 20, 24, 30]`.

### Step 5: Start the Development Servers
Open two terminal windows:

* **Terminal 1: Backend Server**
  ```bash
  cd backend
  npm run dev
  # Server starts on http://localhost:5001
  ```

* **Terminal 2: Frontend Client**
  ```bash
  cd frontend
  npm run dev
  # Web application opens on http://localhost:5173
  ```

---

## 9. Testing & Quality Assurance

The backend includes a comprehensive, multi-layer automated test suite covering schema integrity, API contracts, scenario demonstrations, and edge cases:

```bash
cd backend

# 1. Verify schema constraints and database integrity
npm run verify:db

# 2. Run API integration tests (health, feed, swipe, matches)
npm run test:api

# 3. Validate Scenarios A, B, C, D and privacy enforcement
npm run verify:scenarios

# 4. Run full end-to-end edge-case and concurrency tests
npm run test:e2e
```

### Automated Test Suite Results (74 Assertions)
* ✅ **Candidate Profile Seeding**: 32 candidates seeded with full metadata and >= 3 interests.
* ✅ **Scenario A (Mutual Match)**: Swiping right on Profile 2 (Maya Lin) triggers `isMatch: true`, returns match details, and renders in Matches.
* ✅ **Scenario B (One-Sided Like)**: Swiping right on Profile 4 (Chloe Dubois) returns `isMatch: false` and is strictly omitted from Matches.
* ✅ **Scenario C (Pass Action)**: Swiping left on Profile 3 (Lucas Silva) returns `isMatch: false` and permanently excludes Lucas from the feed.
* ✅ **Scenario D (Persistence)**: Reloading the application retains all swiped exclusions and preserves mutual matches.
* ✅ **Concurrency & Race Conditions**: 6 simultaneous swipe requests for the same profile handled gracefully (1 success, 5 conflict responses).
* ✅ **Input Validation**: Non-numeric IDs, invalid actions, self-swiping, and non-existent profiles rejected with proper HTTP status codes.

---

## 10. Screenshots

| Discover Card Feed | Drag Gesture / Feedback |
| :---: | :---: |
| *(Placeholder: Add screenshot of profile card in Discover tab)* | *(Placeholder: Add screenshot of card dragging with LIKE badge)* |

| It's a Match! Overlay | Mutual Matches View |
| :---: | :---: |
| *(Placeholder: Add screenshot of match celebration screen)* | *(Placeholder: Add screenshot of Matches list view)* |

---

## 11. Implemented Requirements & Scope Summary

| Requirement | Status | Notes |
| :--- | :---: | :--- |
| **Home Tab Placeholder** | ✅ Completed | Blank placeholder per assignment instructions. |
| **Discover Tab** | ✅ Completed | Fully operational card discovery experience. |
| **30+ Mock Profiles** | ✅ Completed | 32 realistic profiles with photos, bios, locations, and interests. |
| **Pre-seeded Incoming Likes** | ✅ Completed | 8 candidate profiles pre-seeded to enable demo matches. |
| **One Card at a Time** | ✅ Completed | Clean portrait orientation with responsive aspect ratio. |
| **Mobile Drag & Desktop Buttons** | ✅ Completed | Touch gestures via Framer Motion + circular Pass/Like buttons. |
| **Visual Feedback & Badges** | ✅ Completed | Real-time dynamic LIKE and PASS overlays based on drag direction. |
| **Exclusion of Swiped Profiles** | ✅ Completed | Swiped profiles never reappear in feed. |
| **Empty Feed State** | ✅ Completed | Friendly caught-up screen with feed refresh button. |
| **Discreet Matching** | ✅ Completed | Match occurs exclusively on mutual like; zero leakage of incoming likes. |
| **Celebration Screen** | ✅ Completed | "It's a Match!" celebration modal overlay. |
| **Matches View** | ✅ Completed | Dedicated grid view listing all confirmed mutual matches. |
| **Persistence Across Reloads** | ✅ Completed | Stored on disk in SQLite with WAL mode. |

### Limitations / Explicit Non-Goals
* **No Authentication**: Per assignment specs, a single demo user (`id: 1`) is used.
* **No In-App Messaging**: In-app chat, payments, recommendation algorithms, or external auth were explicitly out of scope and omitted to maintain a clean, focused codebase.

---

## License
MIT License. Built for the Coy SDE Intern Assignment.
