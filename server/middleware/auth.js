const jwt = require("jsonwebtoken");

const config = require("../config");
const { fail } = require("../utils/response");

const authMiddleware = (req, res, next) => {

  // 檢查是否有token
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return fail(res, {
      statusCode: 401,
      message: "Token is required",
      code: "AUTH_TOKEN_MISSING",
    });
  }

  // 驗證token是否有效
  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (!payload?.id) {
      return fail(res, {
        statusCode: 401,
        message: "Token is invalid",
        code: "AUTH_TOKEN_INVALID",
      });
    }

    // 將使用者資料放進 req.user，然後用 next() 交給下一個 middleware 或 controller。
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
