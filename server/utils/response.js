const success = (res, data = null, options = {}) => {
  const body = {
    success: true,
    data,
  };

  if (options.message) {
    body.message = options.message;
  }

  return res.status(options.statusCode || 200).json(body);
};

const fail = (res, options = {}) => {
  const body = {
    success: false,
    message: options.message || "Internal server error",
    code: options.code || "INTERNAL_ERROR",
  };

  if (options.details) {
    body.details = options.details;
  }

  return res.status(options.statusCode || 500).json(body);
};

module.exports = {
  fail,
  success,
};
