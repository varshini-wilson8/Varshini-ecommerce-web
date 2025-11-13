# E-Commerce Fullstack Demo (React + Node.js)

This demo contains two folders:
- `server` — Express server (port 4000)
- `client` — Vite + React frontend (dev server default port 5173)

## Quick start (local)

### Server
```bash
cd server
npm install
npm start
# server runs at http://localhost:4000
```

### Client
```bash
cd client
npm install
npm run dev
# open the Vite dev URL (usually http://localhost:5173)
```

The frontend expects the backend at `http://localhost:4000/api`. You can change `VITE_API_BASE` env var in the client if needed.

This project is a demo and uses a simple JSON file for persistence (`server/data.json`). Passwords and authentication are intentionally minimal for demonstration only — do not use in production without adding proper hashing and auth.

Enjoy!
