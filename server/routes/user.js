const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const config = require("../config");
const pool = require("../db");
const asyncHandler = require("../middleware/asyncHandler");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const { loginRequest } = require("../validators/requestValidators");

router.get("/success", (req, res) => {
  return success(res, {
    message: "歡迎回來，親愛的會員！",
    time: new Date().toLocaleString(),
  });
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { account, password } = loginRequest(req.body);

    const result = await pool.query(
      "SELECT id, account, password FROM users WHERE account = $1",
      [account]
    );
    const user = result.rows[0];

    if (!user || account !== user.account || password !== user.password) {
      throw new HttpError(401, "帳號或密碼錯誤", null, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      { id: user.id, account: user.account },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return success(
      res,
      {
        token,
        userId: user.id,
      },
      { message: "登入成功" }
    );
  })
);

module.exports = router;
