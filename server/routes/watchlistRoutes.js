const express = require('express');
const createSavedMovieController = require('../controllers/savedMovieController');
const { protect } = require('../middleware/auth');

const router = express.Router();
const { list, add, remove } = createSavedMovieController('watchlist');

router.use(protect);
router.get('/', list);
router.post('/:movieId', add);
router.delete('/:movieId', remove);

module.exports = router;
