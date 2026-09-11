const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const tmdbService = require('../services/tmdbService');

// Favorites and watchlist are structurally identical (add/remove/list a
// saved-movie subdocument array on the user), so both controllers are
// generated from this one factory keyed by the field name. This avoids
// duplicating the same four handlers twice while keeping each route's
// behavior easy to trace back to a single field.
function createSavedMovieController(field) {
  const list = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: { movies: req.user[field] } });
  });

  const add = asyncHandler(async (req, res) => {
    const movieId = Number(req.params.movieId);
    if (!Number.isInteger(movieId)) {
      throw new ApiError(400, 'movieId must be a number');
    }

    const alreadySaved = req.user[field].some((m) => m.movieId === movieId);
    if (alreadySaved) {
      throw new ApiError(409, `Movie is already in your ${field}`);
    }

    const movie = await tmdbService.getMovieDetails(movieId);

    req.user[field].push({
      movieId: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      genreIds: movie.genres?.map((g) => g.id) || movie.genreIds || [],
    });

    await req.user.save();
    res.status(201).json({ success: true, data: { movies: req.user[field] } });
  });

  const remove = asyncHandler(async (req, res) => {
    const movieId = Number(req.params.movieId);
    const before = req.user[field].length;
    req.user[field] = req.user[field].filter((m) => m.movieId !== movieId);

    if (req.user[field].length === before) {
      throw new ApiError(404, `Movie is not in your ${field}`);
    }

    await req.user.save();
    res.status(200).json({ success: true, data: { movies: req.user[field] } });
  });

  return { list, add, remove };
}

module.exports = createSavedMovieController;
