// Wraps an async route/controller so rejected promises reach the
// centralized error middleware instead of becoming unhandled rejections.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
