// A typed error so the error-handling middleware can distinguish
// "expected" failures (bad input, not found) from real server bugs.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = ApiError;
