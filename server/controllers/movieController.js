const tmdbService = require('../services/tmdbService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const parsePage = (value) => {
  const page = parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

// GET /api/movies/popular?page=
const getPopular = asyncHandler(async (req, res) => {
  const data = await tmdbService.getPopular(parsePage(req.query.page));
  res.status(200).json({ success: true, data });
});

// GET /api/movies/top-rated?page=
const getTopRated = asyncHandler(async (req, res) => {
  const data = await tmdbService.getTopRated(parsePage(req.query.page));
  res.status(200).json({ success: true, data });
});

// GET /api/movies/search?query=&page=
const search = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query || !query.trim()) {
    throw new ApiError(400, 'A search query is required');
  }
  const data = await tmdbService.searchMovies(query.trim(), parsePage(req.query.page));
  res.status(200).json({ success: true, data });
});

// GET /api/movies/genres
const getGenres = asyncHandler(async (req, res) => {
  const genres = await tmdbService.getGenres();
  res.status(200).json({ success: true, data: { genres } });
});

// GET /api/movies/genre/:genreId
const getByGenre = asyncHandler(async (req, res) => {
  const data = await tmdbService.getMoviesByGenre(req.params.genreId, parsePage(req.query.page));
  res.status(200).json({ success: true, data });
});

// GET /api/movies/:id
const getById = asyncHandler(async (req, res) => {
  const movie = await tmdbService.getMovieDetails(req.params.id);
  res.status(200).json({ success: true, data: { movie } });
});

module.exports = { getPopular, getTopRated, search, getGenres, getByGenre, getById };
