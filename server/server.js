const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// 引入 Express 框架
const express = require('express');
// 引入 CORS 中介軟體，處理跨域請求
const cors = require('cors');
// 建立一個 Express 應用
const app = express();
// 設定伺服器的監聽埠號
const PORT = 3000;

// 啟用 CORS，允許任何來源的跨域請求
app.use(cors({
  origin: '*',                // 允許所有來源（＊表示不限制）
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE','OPTIONS'],  // 允許這些 HTTP 方法
  allowedHeaders: '*',         // 允許所有標頭
  credentials: false           // 不允許附帶 cookie
}));

// express 內建的 middleware，讓伺服器能夠解析 JSON 格式的請求內容 
// 解析前端送來的 JSON 格式資料 註冊中介層
// middleware 的主要用途就是處理在 request 到達你的路由之前，或者在 response 返回給用戶之前所需要做的各種操作
app.use(express.json());

// 同種類型的處理放一個檔案
const postRoutes = require('./routes/post');
const successRoutes = require('./routes/user');
const classRoutes = require('./routes/class');
const reminderRoutes = require('./routes/reminder');
const paymentRoutes = require('./routes/payment');
app.use('/', successRoutes); // 所有 /welcome 路由就掛上來了
app.use('/', postRoutes);
app.use('/', classRoutes);
app.use('/', reminderRoutes);
app.use('/', paymentRoutes);

// 啟動伺服器，開始監聽指定的埠號
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

//403 跨域禁止
//400 請求格式錯誤 (少資料)
//500 伺服器內部錯誤
//401 未授權(帳密錯)

//使用者 → 前端（React） → [axios 發送 JSON] → 後端（Express）
// 後端處理 → 回傳 JSON 結果 → 前端顯示或跳轉頁面

// 前後端幾乎都用 JSON 溝通，因為它：
// 結構清晰
// JavaScript 原生支援
// 適合 API 設計
// 通用性高，後端語言不管是 Node、Python、Java 都能讀寫
