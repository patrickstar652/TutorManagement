// routes/success.js
const express = require('express');
const router = express.Router();

// 對應 GET /welcome
router.get('/success', (req, res) => {
  res.json({
    message: '歡迎回來，親愛的會員！',
    time: new Date().toLocaleString()
  });
});

module.exports = router;
