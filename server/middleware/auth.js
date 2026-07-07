const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token 未提供" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    if (!payload?.id) {
      return res.status(401).json({ message: "Token 無效：缺少使用者 id" });
    }

    req.user = { id: payload.id, account: payload.account };
    return next();
  } catch (error) {
    console.error("JWT 驗證失敗：", error);
    return res.status(401).json({ message: "Token 無效或已過期" });
  }
};

module.exports = authMiddleware;
