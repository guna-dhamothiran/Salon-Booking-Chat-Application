# Backend — Salon Booking Agent (Express + MongoDB) - Local Setup (no Docker)

## Prerequisites
- Node.js 18+
- npm
- MongoDB running locally (default at mongodb://localhost:27017)

## Quick start (local)
1. Copy `.env.example` to `.env` and set `MONGO_URI` (default: mongodb://localhost:27017/salon)
2. Open a terminal in `backend/`:
   - `npm install`
   - `npm run seed`   # seeds sample services and stylists into MongoDB
   - `npm run dev`    # starts the backend on http://localhost:4000

## Notes
- The project intentionally avoids Docker. Ensure MongoDB is running on your machine.
- Frontend expects backend at http://localhost:4000 by default (or set REACT_APP_API_URL).
