# 📝 Keeper App

Keeper App is a small note-taking demo inspired by Google Keep. It uses React (functional components + hooks) for the frontend and a small Express/Postgres backend to persist notes. The UI uses Material-UI for icons and transitions.

This README focuses on the `keeper-app` folder in this monorepo. It explains how to run the frontend and backend locally, the available API endpoints, and a short troubleshooting/testing guide.

## Features
- Create notes (title + content)
- Edit notes
- Delete notes
- Auto-collapse note form after 2 minutes of inactivity
- Simple REST API backed by PostgreSQL

## Prerequisites
- Node.js (16+ recommended)
- npm (or yarn)
- PostgreSQL instance (local or remote)

## Environment
Create a `.env` file in the `keeper-app` folder (or set env vars in your environment) with the following values:

```
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_NAME=your_db_name
DATABASE_PORT=5432
PORT=5000
```

## Installation
From the `keeper-app` folder:

```bash
npm install
```

## Running the app (development)

1) Start the backend server (Express + Postgres):

```bash
# in keeper-app directory
npm run server
# This runs: nodemon --watch server server.js (per package.json)
```

2) Start the frontend dev server (Vite):

```bash
npm run dev
```

Open the browser at the Vite dev URL (usually `http://localhost:5173` unless configured otherwise).

Note: The backend runs on port 5000 by default. The frontend is configured to call `http://localhost:3000` for API requests (see `src/App.jsx`).

## API Endpoints (backend)

- GET /api/get-notes
   - Returns: JSON array of notes sorted by id desc

- POST /api/add/note
   - Body: { title: string|null, content: string|null }
   - Returns: newly created note object

- PUT /api/notes/:id
   - Body: { title?: string, content?: string }
   - Returns: updated note object (or 404 if not found)

- DELETE /api/notes/:id
   - Returns: 204 on success

## Quick API test (curl)

```bash
# Update note with id=1
curl -X PUT http://localhost:5000/api/notes/1 \
   -H "Content-Type: application/json" \
   -d '{"title":"Updated","content":"Updated content"}'
```

## Project structure

```
keeper-app/
├─ server.js            # Express backend (API + DB queries)
├─ package.json
├─ public/
└─ src/
    ├─ components/
    │  ├─ CreateNote.jsx
    │  ├─ Header.jsx
    │  ├─ Footer.jsx
    │  └─ Note.jsx
    ├─ App.jsx
    ├─ main.jsx
    └─ App.css
```

## Troubleshooting
- 404 on PUT /api/notes/:id: ensure your backend server is running and the note id exists in the `notes` table.
- Database connection errors: verify `.env` values and that Postgres is accessible from your machine.
- React runtime errors related to transitions: make sure components that are children of MUI transitions are DOM elements (not fragments) so transitions can attach props like `style`.

## Contributing
1. Fork
2. Create a branch
3. Commit changes
4. Open a PR

## License
MIT

---

Enjoy using Keeper App! 📝