# QR Redirect React + Express + MongoDB

## What it does
- Each QR code points to a frontend route like `/r/formation-a`
- The React app shows the same form for every QR code
- The Express API validates the QR code and stores form submissions in MongoDB
- After submission, the user is redirected to the external site linked to that QR code

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default local URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Test routes
- `http://localhost:5173/r/formation-a`
- `http://localhost:5173/r/formation-b`
- `http://localhost:5173/r/formation-c`

## Important files
- Backend QR mappings are seeded in `backend/server.js`
- Backend env config is in `backend/.env`
- Frontend API base URL is in `frontend/.env`
