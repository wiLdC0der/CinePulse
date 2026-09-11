const express = require('express');
const router = express.Router();
const { getWatchlist, addWatchlist, removeWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWatchlist);
router.post('/:movieId', addWatchlist);
router.delete('/:movieId', removeWatchlist);

module.exports = router;
