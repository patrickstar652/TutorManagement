// routes/success.js
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

// 對應 GET /success
router.get('/success', (req, res) => {
  res.json({
    message: '歡迎回來，親愛的會員！',
    time: new Date().toLocaleString()
  });
});

// 定義「登入」API 註冊路由
// req 使用者傳來的請求，包括 body、headers、method 等資訊
// res 伺服器回應用的工具，可用來回傳 JSON、狀態碼等
const mockUser = {
  account: 'test123',          
  password: '123456'           
}

router.post('/login', (req, res) => {
  // 從請求的 req body 中取得使用者傳來的帳號和密碼 (前端)
  const { account, password } = req.body; // 請求或回應的主體內容 express 的屬性

  // 如果缺少帳號或密碼，回傳 400 Bad Request
  if (!account || !password) {
    return res.status(400).json({ success: false, message: '請提供帳號和密碼' });
  }

  // 如果帳號密碼正確，回傳登入成功
  if (account === mockUser.account && password === mockUser.password) {

    const token = jwt.sign(
      { account },         // token 裡的內容（payload）
      SECRET_KEY,          // 加密用密鑰
      { expiresIn: '1h' }  // 有效時間
    );
    res.json({
      success: true,
      message: '登入成功',
      token                 // 把 token 回傳給前端
    });

  } else {
    // 否則回傳 401 Unauthorized，表示登入失敗
    res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
  }
});

module.exports = router;
