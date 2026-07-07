class HttpError extends Error {
  constructor(statusCode, message, details = null, code = "REQUEST_ERROR") {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
  }
}

module.exports = HttpError;
