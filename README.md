# Coy — Discover

- **Part A:** App feedback & two core feature suggestions
- **Part B:** Standalone "Discover" tab with swipe interactions, mutual matching, and privacy controls

---

## Part A: Feature Suggestions

After testing the live app at `app.getcoy.com` (OTP login, adding crushes, email verification, invites, and extra slots), here are two features I think Coy should introduce:

### 1. Anonymous Campus / Circle Hints
- **Concept:** When you add someone who isn't on Coy yet (or hasn't added you back), they get an invite link or notification that usually just says *"Someone added you on Coy"*. In practice, people ignore generic invites because they look like spam. Coy could instead show a non-identifying hint like *"Someone from your college batch (e.g. Class of '26) added you to their crush list"*.
- **Why it's needed:** The biggest bottleneck in a secret crush app is the cold-start problem. If the person I like doesn't use Coy, my slot is stuck unless they happen to join. A generic invite text gets ignored, but knowing someone from their immediate college or batch added them creates strong curiosity to download the app and add their own crushes. It drives organic signups while keeping the sender completely anonymous.

### 2. Expiring Crush Slots
- **Concept:** Let users set an expiration window on their crush slots (e.g., 30 days, 60 days, or "End of Semester"). If the other person doesn't add them back before the time runs out, the slot quietly frees up and returns to the user.
- **Why it's needed:** College crushes don't stay the same forever. If someone had a crush during a fall semester lecture, but the other person joins Coy six months later during summer when they've already moved on, an unexpected match out of nowhere can be socially awkward. Letting entries expire naturally keeps things low-pressure, keeps the user's active list relevant, and gives people a reason to check back and refresh their slots periodically.

---

## Part B: Discover Tab

A mobile-first profile discovery and swiping app built according to the assignment requirements.

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion (card drag gestures & physics), Lucide React
- **Backend:** Node.js, Express, `better-sqlite3` (WAL mode enabled)

---

### Getting Started

#### 1. Setup Environment & Install Dependencies

```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

#### 2. Seed Database
The seed script populates 32 candidate profiles and pre-seeds 8 incoming likes on the demo user (`id: 1`) so that mutual matches can be tested immediately:

```bash
cd backend
npm run seed
```

#### 3. Run the App

Start the backend (runs on `http://localhost:5001`):
```bash
cd backend
npm run dev
```

In a second terminal, start the frontend (runs on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### How Matching & Privacy Work

1. **Feed (`GET /api/feed`):** Returns candidate profiles that the demo user has not swiped on yet. To respect Coy's privacy promise, the query simply filters out already-swiped profile IDs—it never joins incoming likes or exposes whether someone has liked the user.
2. **Swiping (`POST /api/swipe`):**
   - Swiping right (`LIKE`) checks if the target profile has already liked the demo user (`swiper_id = target AND swiped_id = 1 AND action = 'LIKE'`).
   - If yes, a mutual match row is created atomically in SQLite and returned with `isMatch: true`.
   - If no reciprocal like exists, the like is saved in `swipes` and returns `isMatch: false`.
   - Swiping left (`PASS`) records the pass and will never create a match.
3. **Matches (`GET /api/matches`):** Only returns confirmed mutual matches. One-sided incoming likes are never shown here.
4. **Persistence:** All swipes and matches are stored in SQLite (`coy.db`) and persist across page reloads and server restarts.

---

### Running Tests

Automated tests covering schema constraints, API endpoints, scenario edge cases, and concurrency:

```bash
cd backend
npm run verify:db        # Database schema & constraints check
npm run test:api         # API integration tests
npm run verify:scenarios # Mutual match, one-sided like, pass, and reload scenarios
npm run test:e2e         # Edge cases (concurrency, duplicate swipes, invalid input)
```
