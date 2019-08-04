class InvalidDateError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidDateError);
  }
}

module.exports = { InvalidDateError };