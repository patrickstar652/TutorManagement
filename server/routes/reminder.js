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

  // 驗證 schedule_id 必須存在且有效
  if (!schedule_id) {
    return res.status(400).json({ 
      success: false, 
      message: "schedule_id 為必填，請選擇一個課程" 
    });
  }

  try {
    // 驗證 schedule_id 是否屬於該使用者
    const scheduleCheck = await pool.query(
      "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
      [schedule_id, req.user.id]
    );
    
    if (scheduleCheck.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "無權操作此課程或課程不存在" 
      });
    }

    // 處理 remind_at 欄位 - 如果是空字串或空值，設為 null
    let processedRemindAt = null;
    if (remind_at && remind_at.trim() !== '') {
      // 組合日期和時間成為完整的 timestamp
      processedRemindAt = `${remind_date} ${remind_at}:00`;
    }

    const result = await pool.query(
      `INSERT INTO reminders (user_id, schedule_id, title, description, remind_at, remind_date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, schedule_id, title, description, processedRemindAt, remind_date]
    );
    
    res.status(200).json({
      success: true,
      message: "新增提醒成功",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("新增提醒失敗：", err);
    console.error("錯誤詳情：", err.message);
    res.status(500).json({ 
      success: false, 
      message: "新增提醒失敗",
      error: err.message 
    });
  }
});

router.get("/reminder", async (req, res) => {
  const { scheduleId } = req.query;
  
  try {
    let query;
    let params;
    
    if (scheduleId) {
      // 如果有指定 scheduleId，只取該課程的提醒
      query = `SELECT r.*, s.course_name 
               FROM reminders r 
               LEFT JOIN schedule s ON r.schedule_id = s.id 
               WHERE r.user_id = $1 AND r.schedule_id = $2 
               ORDER BY r.remind_date, r.remind_at`;
      params = [req.user.id, scheduleId];
    } else {
      // 如果沒有指定 scheduleId，取該使用者的所有提醒
      query = `SELECT r.*, s.course_name 
               FROM reminders r 
               LEFT JOIN schedule s ON r.schedule_id = s.id 
               WHERE r.user_id = $1 
               ORDER BY r.remind_date, r.remind_at`;
      params = [req.user.id];
    }
    
    const result = await pool.query(query, params);
    
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

// 刪除提醒
router.delete("/reminder/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // 確保只能刪除自己的提醒
    const result = await pool.query(
      "DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "提醒不存在或無權限刪除" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "刪除提醒成功"
    });
  } catch (err) {
    console.error("刪除提醒失敗：", err);
    res.status(500).json({ 
      success: false, 
      message: "刪除提醒失敗" 
    });
  }
});

module.exports = router;
