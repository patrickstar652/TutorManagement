const { fail } = require("../utils/response");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.statusCode) {
    return fail(res, {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code || "REQUEST_ERROR",
      details: error.details,
    });
  }

  console.error("Unhandled server error:", error);

  return fail(res, {
    statusCode: 500,
    message: "伺服器錯誤，請稍後再試",
    code: "INTERNAL_ERROR",
  });
};

module.exports = errorHandler;
