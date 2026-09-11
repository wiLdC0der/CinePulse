# CinePulse - Movie Discovery Application

A full-stack Movie Discovery web application built with **React**, **Node.js**, **Express**, **MongoDB**, and **TMDB API**. Users can discover trending movies, search by title or genre, view detailed information, create accounts, and manage personalized Favorites and Watchlist.

---

## Architecture Diagram

```
+------------------+         REST API          +--------------------+
|                  | ----------------------->  |                    |
|  React (Vite)    |   http://localhost:5000   |  Express Backend   |
|  Tailwind CSS    | <-----------------------  |                    |
+------------------+                           +---------+----------+
                                                         |
                                       +-----------------+-----------------+
                                       |                                   |
                                       v                                   v
                             +------------------+                +------------------+
                             |                  |                |                  |
                             |  MongoDB Atlas   |                |  TMDB v3 API     |
                             |  (Users/Favs/WL) |                |  (External Data) |
                             +------------------+                +------------------+
```

---

## Features

- **Movie Discovery & Trending**: Explore popular and trending movies of the week with normalized poster images, release dates, and vote ratings.
- **Search & Filter**: Search movies by title with debounced input and filter by genre categories. Maintains query parameters in the URL (`/discover?query=batman&page=2&genre=28`) so search state is bookmarkable and shareable.
- **Detailed Movie Pages**: View high-resolution backdrops, cast & crew credits, directors, runtime, tagline, overview, genres, and recommended titles.
- **User Authentication**: Secure signup and signin using JWT authentication, password hashing with bcrypt, and validation middleware.
- **Favorites & Watchlist**: Authenticated users can save movies to their Favorites or Watchlist. Server-side persistence ensures saved items persist across browser sessions.
- **Responsive & Accessible UI**: Dark-mode streaming layout, skeleton loading placeholders, intuitive empty states, and custom error boundaries.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4
- **API Client**: Axios with automatic Bearer token interceptor
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `express-validator`
- **Security**: CORS, environment secret isolation, centralized error handling

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Movies (TMDB Proxy)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/movies/popular?page=` | Fetch popular movies | No |
| `GET` | `/api/movies/trending?page=` | Fetch trending movies | No |
| `GET` | `/api/movies/search?query=&page=&genre=` | Search & filter movies | No |
| `GET` | `/api/movies/genres` | Fetch movie genres list | No |
| `GET` | `/api/movies/genre/:genreId?page=` | Fetch movies by genre ID | No |
| `GET` | `/api/movies/:id` | Fetch movie details with credits & cast | No |

### Favorites
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/favorites` | Fetch user's favorited movies | Yes |
| `POST` | `/api/favorites/:movieId` | Add movie to user's favorites | Yes |
| `DELETE` | `/api/favorites/:movieId` | Remove movie from favorites | Yes |

### Watchlist
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/watchlist` | Fetch user's watchlist | Yes |
| `POST` | `/api/watchlist/:movieId` | Add movie to user's watchlist | Yes |
| `DELETE` | `/api/watchlist/:movieId` | Remove movie from watchlist | Yes |

---

## Database Schema

### User Model (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Hashed using bcrypt
  favorites: [
    {
      movieId: String,
      title: String,
      posterPath: String,
      backdropPath: String,
      releaseDate: String,
      voteAverage: Number,
      overview: String,
      genres: [{ id: Number, name: String }],
      addedAt: Date
    }
  ],
  watchlist: [ /* Same subdocument structure as favorites */ ],
  timestamps: true
}
```

---

## Environment Variables

### Backend (`server/.env.example`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/movie_discovery
JWT_SECRET=your_super_secret_jwt_key
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

---

## Local Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Local MongoDB server or MongoDB Atlas connection string)
- TMDB API Key (obtained from [TheMovieDatabase](https://www.themoviedb.org/settings/api))

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Update `.env` with your actual `MONGODB_URI`, `JWT_SECRET`, and `TMDB_API_KEY`.

Start the backend server:
```bash
npm start
# Server will run at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# App will run at http://localhost:5173
```

---

## Security Considerations

1. **TMDB Key Isolation**: The frontend never communicates directly with TMDB. All movie requests are proxied through the Express backend, keeping the TMDB API key secure.
2. **Password Hashing**: Passwords are hashed using `bcryptjs` before storage in MongoDB using Mongoose pre-save hooks. Plaintext passwords are never stored or returned.
3. **JWT Authentication**: User sessions are authenticated using signed JSON Web Tokens passed via HTTP `Authorization: Bearer <token>` headers.
4. **Input Validation**: Request bodies and parameters are validated using `express-validator` to prevent injection and invalid payload processing.
5. **CORS & Environment Protection**: CORS is configured to protect resource access, and credentials are strictly stored in `.env` files.

---

## Design Decisions & Trade-offs

- **Normalized TMDB Data**: External TMDB responses vary in field naming (e.g. `poster_path` vs `posterPath`, `release_date` vs `releaseDate`). The backend normalizes response objects before returning them to ensure frontend components remain simple and consistent.
- **Embedded Favorites/Watchlist**: Storing lightweight movie snapshots (id, title, poster, release date, rating) in the `User` document allows favorites and watchlist pages to render instantly without firing multiple separate N+1 TMDB API requests.
- **React Context for Auth**: Used React Context solely for authentication and user preferences rather than adding unnecessary state overhead like Redux.

---

## Future Improvements

- **Redis Caching**: Cache TMDB API calls (such as popular movies and genre lists) in Redis to lower TMDB rate limit usage and speed up response times.
- **Recommendation Engine**: Personalize movie recommendations based on user favorites and genre preferences.
- **Automated Testing**: Add Jest/Supertest suite for backend endpoints and React Testing Library tests for UI components.
- **CI/CD Pipeline**: Setup GitHub Actions workflow for linting, building, and automated deployment.
