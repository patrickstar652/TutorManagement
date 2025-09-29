// routes/success.js
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// 引入 postgreSQL
const { Pool } = require("pg");

// 建立 PostgreSQL Pool
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

// 對應 GET /success
router.get("/success", (req, res) => {
  res.json({
    message: "歡迎回來，親愛的會員！",
    time: new Date().toLocaleString(),
  });
});

// 定義「登入」API 註冊路由
// req 使用者傳來的請求，包括 body、headers、method 等資訊
// res 伺服器回應用的工具，可用來回傳 JSON、狀態碼等
router.post("/login", async (req, res) => {
  const { account, password } = req.body || {}; // 加入防呆，避免 req.body 是 undefined

  // if (!account || !password) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "請提供帳號和密碼" });
  // }

  try {
    // 只取需要的欄位
    const result = await pool.query(
      "SELECT id, account, password FROM users WHERE account = $1",
      [account] // 將變數帶入 $1 的位置
    );

    // if (result.rows.length === 0) {
    //   return res.status(401).json({ success: false, message: "帳號不存在" });
    // }

    const user = result.rows[0];

    if (user && account === user.account && password === user.password) {
      // ⚠️ 關鍵：把 id 一起放進 token，後續 authMiddleware 會檢查 payload.id
      // 登入成功後：
      const token = jwt.sign(
        { id: user.id, account: user.account }, // 一定要帶 id
        SECRET_KEY,
        { expiresIn: "12h" }  
      );

      res.json({
        success: true,
        message: "登入成功",
        token,
        userId: user.id,
      });
    } else {
      res.status(401).json({ success: false, message: "帳號或密碼錯誤" });
    }
  } catch (err) {
    console.error("登入錯誤：", err); // 後端顯示錯誤
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，請稍後再試", // 回傳錯誤訊息給前端
    });
  }
});

module.exports = router;
