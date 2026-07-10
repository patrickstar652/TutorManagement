const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// 引入 Express 框架
const express = require('express');
// 引入 CORS 中介軟體，處理跨域請求
const cors = require('cors');
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");
// 建立一個 Express 應用
const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (config.clientOrigins === "*") {
      return callback(null, true);
    }

    if (!origin || config.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: '*',
  credentials: false,
};

// 啟用 CORS，允許任何來源的跨域請求
app.use(cors(corsOptions));

// express 內建的 middleware，讓伺服器能夠解析 JSON 格式的請求內容 
// 解析前端送來的 JSON 格式資料 註冊中介層
// middleware 的主要用途就是處理在 request 到達你的路由之前，或者在 response 返回給用戶之前所需要做的各種操作
app.use(express.json());

// 符合後進入路由，路由會依照請求的 URL 路徑來決定要執行哪個 controller 的 function
const courseRoutes = require('./routes/course');
const successRoutes = require('./routes/user');
const classRoutes = require('./routes/class');
const reminderRoutes = require('./routes/reminder');
const paymentRoutes = require('./routes/payment');

// 先依序查詢
app.use('/', successRoutes);
app.use('/', courseRoutes);
app.use('/', classRoutes);
app.use('/', reminderRoutes);
app.use('/', paymentRoutes);
app.use(errorHandler);

// 啟動伺服器，開始監聽指定的埠號
app.listen(config.port, () => {
  console.log(`✅ Server running at http://localhost:${config.port}`);
});
