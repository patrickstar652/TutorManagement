const express = require("express");
const router = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

const loggerMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token 未提供" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    if (!payload?.id) {
      return res.status(401).json({ message: "Token 無效：缺少使用者 id" });
    }
    req.user = { id: payload.id, account: payload.account };
    next();
  } catch (err) {
    console.error("JWT 驗證失敗：", err);
    return res.status(401).json({ message: "Token 無效或已過期" });
  }
};

router.use(loggerMiddleware);

router.post("/reminder", async (req, res) => {
  const { title, description, remind_at, remind_date, schedule_id } = req.body || {};
  
  // 驗證必要欄位
  if (!title || !remind_date) {
    return res.status(400).json({ 
      success: false, 
      message: "title 和 remind_date 為必填" 
    });
  }

  try {
    // 如果提供schedule_id，驗證是否屬於該使用者
    if (schedule_id) {
      const scheduleCheck = await pool.query(
        "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
        [schedule_id, req.user.id]
      );
      
      if (scheduleCheck.rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: "無權操作此課程" 
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO reminders (title, description, remind_at, remind_date, user_id, schedule_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, remind_at, remind_date, req.user.id, schedule_id || null]
    );
    
    res.status(200).json({
      success: true,
      message: "新增提醒成功",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("新增提醒失敗：", err);
    res.status(500).json({ 
      success: false, 
      message: "新增提醒失敗" 
    });
  }
});

router.get("/reminder", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, s.course_name 
       FROM reminders r 
       LEFT JOIN schedule s ON r.schedule_id = s.id 
       WHERE r.user_id = $1 
       ORDER BY r.remind_date, r.remind_at`,
      [req.user.id]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("取得提醒失敗：", err);
    res.status(500).json({ 
      success: false, 
      message: "取得提醒失敗" 
    });
  }
});
module.exports = router;
