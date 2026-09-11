const express = require('express');
const router = express.Router();
const {
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  getMovieGenres,
  getMoviesByGenre,
  getMovieDetails
} = require('../controllers/movieController');

router.get('/popular', getPopularMovies);
router.get('/trending', getTrendingMovies);
router.get('/search', searchMovies);
router.get('/genres', getMovieGenres);
router.get('/genre/:genreId', getMoviesByGenre);
router.get('/:id', getMovieDetails);

module.exports = router;
