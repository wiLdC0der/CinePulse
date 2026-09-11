const User = require('../models/User');
const tmdbService = require('../services/tmdbService');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      watchlist: user.watchlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/watchlist/:movieId
// @access  Private
const addWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    // Check duplicate
    const exists = user.watchlist.some(item => String(item.movieId) === String(movieId));
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Movie is already in your watchlist'
      });
    }

    let movieData = req.body;
    if (!movieData.title) {
      try {
        const details = await tmdbService.getMovieDetails(movieId);
        movieData = {
          movieId: String(details.id),
          title: details.title,
          posterPath: details.posterPath || '',
          backdropPath: details.backdropPath || '',
          releaseDate: details.releaseDate || '',
          voteAverage: details.voteAverage || 0,
          overview: details.overview || '',
          genres: details.genres || []
        };
      } catch (err) {
        return res.status(404).json({
          success: false,
          message: 'Could not retrieve movie details to add to watchlist'
        });
      }
    } else {
      movieData.movieId = String(movieId);
    }

    user.watchlist.push(movieData);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Added to watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
const removeWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    user.watchlist = user.watchlist.filter(item => String(item.movieId) !== String(movieId));
    await user.save();

    res.json({
      success: true,
      message: 'Removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addWatchlist,
  removeWatchlist
};
