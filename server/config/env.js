// Central place to load and validate required environment variables.
// Failing fast here means a missing key surfaces as a clear startup
// error instead of a confusing failure deep inside a request handler.
require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'TMDB_API_KEY', 'TMDB_BASE_URL'];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Thrown at import time so the server never starts in a half-configured state.
  throw new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Copy server/.env.example to server/.env and fill in the values.'
  );
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  tmdbApiKey: process.env.TMDB_API_KEY,
  tmdbBaseUrl: process.env.TMDB_BASE_URL,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
