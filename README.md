# Movie Discovery App

## Overview

Reel is a full-stack movie discovery app. Users can browse popular and
top-rated movies, search by title, filter by genre, view movie details
(cast, runtime, overview), and — once logged in — save movies to a
Favorites list and a Watchlist that persist across sessions.

The app is split into a React frontend and an Express/MongoDB backend.
The backend is the only thing that talks to TMDB, so the TMDB API key
never reaches the browser.

## Features

- Browse popular and top-rated movies on the home page
- Search movies by title, with debounced input and URL-synced state
  (`/discover?query=batman&page=2`) so results are shareable/refreshable
- Filter by genre
- Paginated results (server-driven, using TMDB's own pagination)
- Movie details page: poster, backdrop, overview, genres, runtime,
  director, top billed cast
- Register / log in with JWT-based auth, passwords hashed with bcrypt
- Add/remove Favorites and Watchlist entries (duplicate-safe), gated
  behind login with a clear prompt for logged-out users
- Loading (skeleton cards), empty, and error states (with retry) on
  every async section
- Responsive layout from mobile to desktop
- Basic accessibility: semantic elements, labeled inputs, alt text,
  visible focus rings, keyboard-operable controls

## Tech Stack

**Frontend:** React, Vite, React Router, Tailwind CSS, Axios
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs,
express-validator

No Redux, GraphQL, TypeScript, or other heavier tooling — the app's
state and data flow are simple enough that they'd add ceremony without
adding value.

## Architecture

```
React (Vite)
   ↓  Axios, JWT in Authorization header
Express REST API
   ↓                              ↓
MongoDB (users, favorites,   TMDB API (popular, search,
watchlist)                   details, genres)
```

The frontend never calls TMDB directly. It calls the Express API, which
calls TMDB using a server-side API key and normalizes the response
before sending it back. This keeps the key private and gives the
frontend one consistent movie shape regardless of which TMDB endpoint
produced it.

### Backend structure

```
server/
  config/       env loading + validation, MongoDB connection
  controllers/  request handling (auth, movies, favorites/watchlist)
  middleware/   JWT auth guard, centralized error handler, validation
  models/       User (with embedded favorites/watchlist subdocuments)
  routes/       route definitions, wired to controllers
  services/     tmdbService.js — the only file that talks to TMDB
  utils/        asyncHandler, ApiError, generateToken
```

### Frontend structure

```
client/src/
  components/   MovieCard, MovieGrid, Navbar, Pagination, SearchBar,
                GenreFilter, Skeleton/Empty/Error states, ProtectedRoute
  pages/        Home, Discover, MovieDetails, Login, Register,
                Favorites, Watchlist, NotFound
  context/      AuthContext (session), SavedMoviesContext (favorites/
                watchlist membership, used by every movie card)
  services/     one file per API resource (auth, movies, favorites,
                watchlist) built on a shared axios instance
  hooks/        useDebounce
  utils/        format.js (release year, rating, runtime formatting)
```

## API Endpoints

**Auth**
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Log in, returns a JWT |
| GET | `/api/auth/me` | required | Current user |

**Movies** (all backed by TMDB, normalized)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/popular?page=` | Popular movies |
| GET | `/api/movies/top-rated?page=` | Top rated movies |
| GET | `/api/movies/search?query=&page=` | Search by title |
| GET | `/api/movies/genres` | Genre list (for the filter UI) |
| GET | `/api/movies/genre/:genreId?page=` | Movies in a genre |
| GET | `/api/movies/:id` | Movie details + cast/director |

**Favorites / Watchlist** (both require a valid JWT; shape is identical)
| Method | Endpoint |
|---|---|
| GET | `/api/favorites` / `/api/watchlist` |
| POST | `/api/favorites/:movieId` / `/api/watchlist/:movieId` |
| DELETE | `/api/favorites/:movieId` / `/api/watchlist/:movieId` |

All responses follow `{ success, data }` on success and
`{ success: false, message }` on error.

## Database Schema

A single `User` collection:

```
User
  name        String, required
  email       String, required, unique (indexed), lowercase
  password    String, required, hashed with bcrypt, never returned by
              default queries (select: false)
  favorites   [SavedMovie]
  watchlist   [SavedMovie]
  createdAt / updatedAt   (timestamps)

SavedMovie (embedded subdocument, not its own collection)
  movieId       Number  — TMDB id
  title         String
  posterUrl     String
  releaseDate   String
  voteAverage   Number
  genreIds      [Number]
  addedAt       Date
```

Favorites and watchlist are embedded on the user document rather than
a separate collection with a foreign key, since they're always read
and written per-user and never queried across users. Each entry stores
just enough to render a movie card (poster, title, year, rating) so
the Favorites/Watchlist pages don't need a TMDB round trip — only
adding a new entry does.

## Authentication

- Passwords are hashed with bcrypt (10 salt rounds) in a Mongoose
  `pre('save')` hook — the plaintext password never reaches storage,
  and the hash is excluded from query results unless explicitly
  selected (used only for login's password comparison).
- On successful register/login, the API signs a JWT (`{ sub: userId }`)
  with `JWT_SECRET` and a configurable expiry (`JWT_EXPIRES_IN`,
  default 7 days).
- The frontend stores the token in `localStorage` and attaches it as
  `Authorization: Bearer <token>` on every request via an Axios
  interceptor.
- Protected routes run an `auth` middleware that verifies the token,
  loads the user, and rejects with 401 on a missing/invalid/expired
  token or a deleted user.

## Environment Variables

**server/.env** (copy from `server/.env.example`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movie-discovery
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your-tmdb-v3-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `client/.env.example`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

The server validates required variables at startup (`config/env.js`)
and throws a clear error naming whatever's missing, instead of failing
later inside a request.

## Local Setup

Requirements: Node.js 18+, a MongoDB instance (local or Atlas), and a
free [TMDB API key](https://www.themoviedb.org/settings/api).

```bash
# 1. Backend
cd server
cp .env.example .env    # then fill in MONGODB_URI, JWT_SECRET, TMDB_API_KEY
npm install
npm run dev              # http://localhost:5000

# 2. Frontend (new terminal)
cd client
cp .env.example .env     # defaults are fine for local dev
npm install
npm run dev               # http://localhost:5173
```

## Security Considerations

- **Passwords**: bcrypt-hashed, never logged or returned by the API.
- **JWT**: signed with a server-only secret; the secret and expiry are
  environment-driven, not hardcoded.
- **Secrets**: `MONGODB_URI`, `JWT_SECRET`, and `TMDB_API_KEY` are read
  from environment variables only. `.env` is git-ignored; `.env.example`
  documents the required keys without values.
- **TMDB key isolation**: only `services/tmdbService.js` ever calls
  TMDB. The frontend calls the Express API and never sees the key.
- **Validation**: `express-validator` checks registration/login input
  (name required, valid email, 8+ character password) before it
  reaches the database; Mongoose schema validation is a second layer.
- **CORS**: restricted to `CLIENT_URL` rather than left open to any
  origin.
- **Error handling**: a centralized error middleware normalizes
  Mongoose validation errors, duplicate-key errors, and JWT errors
  into consistent `{ success: false, message }` responses, and only
  includes a stack trace when `NODE_ENV=development`.

## Design Decisions / Trade-offs

- **Embedded favorites/watchlist vs. a separate collection**: embedding
  keeps reads simple (one query returns everything needed for the
  Favorites/Watchlist pages) at the cost of the array growing
  unbounded on the user document. For a personal watchlist app this is
  a reasonable trade — a heavy user with thousands of entries would be
  the point at which a separate, indexed collection becomes worth the
  extra query.
- **Storing a poster URL, not just a path**: TMDB returns image
  *paths*, not full URLs, and building the final URL requires knowing
  TMDB's image base + size, which is TMDB configuration detail the
  frontend shouldn't need to know. The backend resolves the full URL
  once, in `tmdbService.js`, and stores/returns that.
- **No client-side movie cache/state library**: movie data is fetched
  per page from the API as needed. Given the page count and TMDB's own
  response times, a caching layer wasn't worth the added complexity for
  this scope — see Future Improvements.
- **Auth state and saved-movie membership in Context, not Redux**: the
  only truly global state is "who is logged in" and "which movies are
  saved" (checked by every movie card for its heart/bookmark icon).
  Everything else is local `useState`/`useEffect` per page.
- **JWT in localStorage over httpOnly cookies**: simpler to implement
  correctly within this project's scope (no CSRF token plumbing, no
  cookie-domain configuration for local dev). The trade-off is that a
  successful XSS attack could read the token; React's default escaping
  and the absence of `dangerouslySetInnerHTML` anywhere in the app
  mitigate but don't eliminate that risk. A production version aimed
  at real users would move to httpOnly cookies.

## Future Improvements

- Server-side caching (e.g. short-TTL in-memory cache) for popular/
  top-rated TMDB responses, which don't change minute to minute
- A basic recommendation feed based on saved favorites' genres
- More advanced filters (release year range, minimum rating, sort order)
- Automated tests (API integration tests with Supertest, component
  tests with React Testing Library) — this build was verified manually
- CI to run lint/tests on push

## Testing Notes

This project was built and reviewed in a sandboxed environment without
outbound network access, so `npm install` and a live TMDB/MongoDB run
could not be executed here. Every backend and frontend file was
syntax-checked (Node's parser for the backend, esbuild for the JSX/ESM
frontend) and reviewed end-to-end for logical consistency between the
API contract, service layer, and UI. Before treating this as complete,
run through the manual test list below locally — it mirrors the
assignment's testing checklist:

- Auth: register, duplicate email rejection, login, wrong password,
  logout, protected route redirect when logged out
- Movies: popular, search, invalid/empty search, movie details,
  pagination, TMDB failure (try an invalid `TMDB_API_KEY` to see the
  error state)
- Favorites/Watchlist: add, remove, duplicate prevention, persistence
  across logout/login
- UI: desktop and mobile widths, loading/empty/error states on each
  async section
