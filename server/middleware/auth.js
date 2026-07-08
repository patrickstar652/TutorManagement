const jwt = require("jsonwebtoken");

const config = require("../config");
const { fail } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return fail(res, {
      statusCode: 401,
      message: "Token is required",
      code: "AUTH_TOKEN_MISSING",
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (!payload?.id) {
      return fail(res, {
        statusCode: 401,
        message: "Token is invalid",
        code: "AUTH_TOKEN_INVALID",
      });
    }

    req.user = { id: payload.id, account: payload.account };
    return next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return fail(res, {
      statusCode: 401,
      message: "Token is invalid or expired",
      code: "AUTH_TOKEN_INVALID",
    });
  }
};

module.exports = authMiddleware;
