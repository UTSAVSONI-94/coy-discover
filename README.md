# Coy — Discover Tab (SDE Intern Assignment)

A standalone mobile-first profile discovery and matching application built for the Coy SDE Intern Assignment.

## Architecture

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: SQLite (`better-sqlite3`)

## Directory Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev # Runs on http://localhost:5173
```
