const express = require('express');
const {
  getPopular,
  getTopRated,
  search,
  getGenres,
  getByGenre,
  getById,
} = require('../controllers/movieController');

const router = express.Router();

// Specific routes must be registered before the /:id catch-all below,
// otherwise "popular", "search", etc. would be parsed as a movie id.
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/search', search);
router.get('/genres', getGenres);
router.get('/genre/:genreId', getByGenre);
router.get('/:id', getById);

module.exports = router;
