const User = require('../models/User');
const tmdbService = require('../services/tmdbService');

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      favorites: user.favorites || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to favorites
// @route   POST /api/favorites/:movieId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if already in favorites
    const exists = user.favorites.some(fav => String(fav.movieId) === String(movieId));
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Movie is already in your favorites'
      });
    }

    let movieData = req.body;
    // If essential fields are missing in body, fetch from TMDB
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
          message: 'Could not retrieve movie details to add to favorites'
        });
      }
    } else {
      movieData.movieId = String(movieId);
    }

    user.favorites.push(movieData);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(fav => String(fav.movieId) !== String(movieId));
    await user.save();

    res.json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
