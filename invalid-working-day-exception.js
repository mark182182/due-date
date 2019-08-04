class InvalidWorkingDayError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidWorkingDayError);
  }
}

module.exports = { InvalidWorkingDayError };