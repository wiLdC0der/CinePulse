const tmdbService = require('../services/tmdbService');

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await tmdbService.getPopular(page);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await tmdbService.getTrending(page);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// @desc    Search movies by query and/or genre
// @route   GET /api/movies/search?query=&page=&genre=
// @access  Public
const searchMovies = async (req, res, next) => {
  try {
    const query = req.query.query || '';
    const page = parseInt(req.query.page, 10) || 1;
    const genreId = req.query.genre || null;

    const data = await tmdbService.searchMovies(query, page, genreId);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie genres list
// @route   GET /api/movies/genres
// @access  Public
const getMovieGenres = async (req, res, next) => {
  try {
    const genres = await tmdbService.getGenres();
    res.json({ success: true, genres });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genreId
// @access  Public
const getMoviesByGenre = async (req, res, next) => {
  try {
    const { genreId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const data = await tmdbService.getByGenre(genreId, page);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await tmdbService.getMovieDetails(id);
    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  getMovieGenres,
  getMoviesByGenre,
  getMovieDetails
};
