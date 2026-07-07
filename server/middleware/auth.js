const jwt = require("jsonwebtoken");

require("dotenv").config();

const config = require("../config");
const { fail } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return fail(res, {
      statusCode: 401,
      message: "Token 未提供",
      code: "AUTH_TOKEN_MISSING",
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (!payload?.id) {
      return fail(res, {
        statusCode: 401,
        message: "Token 無效：缺少使用者 id",
        code: "AUTH_TOKEN_INVALID",
      });
    }

    req.user = { id: payload.id, account: payload.account };
    return next();
  } catch (error) {
    console.error("JWT 驗證失敗：", error);
    return fail(res, {
      statusCode: 401,
      message: "Token 無效或已過期",
      code: "AUTH_TOKEN_INVALID",
    });
  }
};

module.exports = authMiddleware;
