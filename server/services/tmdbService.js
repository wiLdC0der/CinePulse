const axios = require('axios');
const { tmdbApiKey, tmdbBaseUrl } = require('../config/env');
const ApiError = require('../utils/ApiError');

// All TMDB communication lives here so the rest of the app never has
// to think about the TMDB base URL, auth scheme, or response shape.
const tmdb = axios.create({
  baseURL: tmdbBaseUrl,
  timeout: 8000,
  params: { api_key: tmdbApiKey },
});

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function backdropUrl(path, size = 'w1280') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

// Trims a raw TMDB movie object down to the fields the frontend
// actually renders, and normalizes image paths into full URLs.
function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: posterUrl(movie.poster_path),
    backdropUrl: backdropUrl(movie.backdrop_path),
    releaseDate: movie.release_date || null,
    voteAverage: movie.vote_average ?? 0,
    genreIds: movie.genre_ids || (movie.genres ? movie.genres.map((g) => g.id) : []),
  };
}

function normalizeMovieDetails(movie, credits) {
  const director = credits?.crew?.find((c) => c.job === 'Director');
  return {
    ...normalizeMovie(movie),
    runtime: movie.runtime || null,
    genres: movie.genres || [],
    tagline: movie.tagline || '',
    director: director ? director.name : null,
    cast: (credits?.cast || []).slice(0, 8).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: posterUrl(c.profile_path, 'w185'),
    })),
  };
}

// Wraps every TMDB call so a network/API failure becomes a clean
// ApiError instead of an axios error leaking implementation details.
async function safeRequest(path, params) {
  try {
    const { data } = await tmdb.get(path, { params });
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new ApiError(500, 'TMDB rejected the API key. Check TMDB_API_KEY on the server.');
    }
    if (err.response?.status === 404) {
      throw new ApiError(404, 'Movie not found');
    }
    throw new ApiError(502, 'Unable to reach the movie database right now. Please try again.');
  }
}

async function getPopular(page = 1) {
  const data = await safeRequest('/movie/popular', { page });
  return {
    results: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

async function getTopRated(page = 1) {
  const data = await safeRequest('/movie/top_rated', { page });
  return {
    results: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

async function searchMovies(query, page = 1) {
  const data = await safeRequest('/search/movie', { query, page, include_adult: false });
  return {
    results: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

async function getMoviesByGenre(genreId, page = 1) {
  const data = await safeRequest('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  });
  return {
    results: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

async function getMovieDetails(id) {
  const [movie, credits] = await Promise.all([
    safeRequest(`/movie/${id}`),
    safeRequest(`/movie/${id}/credits`),
  ]);
  return normalizeMovieDetails(movie, credits);
}

async function getGenres() {
  const data = await safeRequest('/genre/movie/list');
  return data.genres;
}

module.exports = {
  getPopular,
  getTopRated,
  searchMovies,
  getMoviesByGenre,
  getMovieDetails,
  getGenres,
};
