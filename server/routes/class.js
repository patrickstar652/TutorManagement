const express = require("express");
const router = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const pool = require("../db");

// Middleware: 驗證 Token
const loggerMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token 未提供" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    // 確保 payload 裡面有我們需要的 id
    if (!payload?.id) {
      return res.status(401).json({ message: "Token 無效：缺少使用者 id" });
    }
    // 把解碼後的資料掛在 req.user 上
    req.user = { id: payload.id, account: payload.account };
    next();
  } catch (err) {
    console.error("JWT 驗證失敗：", err);
    return res.status(401).json({ message: "Token 無效或已過期" });
  }
};

// 套用 middleware
router.use(loggerMiddleware);

// 取得課程列表
router.get("/class", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id as class_id,
        c.schedule_id,
        s.course_name,
        s.weekday,
        s.start_time,
        s.end_time
      FROM class c 
      JOIN schedule s ON c.schedule_id = s.id
      WHERE c.user_id = $1
    `, [req.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// 🔥 更新座位 (同時處理繳費單建檔)
router.patch("/seat", async (req, res) => {
  const { schedule_id, seat_id, name } = req.body;

  try {
    // 1. 驗證必要欄位
    if (!schedule_id || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "schedule_id 和 seat_id 是必要欄位",
      });
    }

    // 2. 先取得現有的 members 陣列並檢查權限
    const currentResult = await pool.query(
      "SELECT members FROM class WHERE schedule_id = $1 AND user_id = $2",
      [schedule_id, req.user.id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的課程",
      });
    }

    // 3. 處理座位陣列邏輯
    let members = currentResult.rows[0].members || [];
    const seatString = `${seat_id}:${name || ""}`; // 格式: "A1:王小明"

    // 檢查該座位 ID 是否已存在
    const existingIndex = members.findIndex((member) =>
      member.startsWith(`${seat_id}:`)
    );

    if (existingIndex >= 0) {
      members[existingIndex] = seatString; // 更新舊座位
    } else {
      members.push(seatString); // 新增新座位
    }

    // 4. 更新 Class 表的 members 陣列
    const result = await pool.query(
      "UPDATE class SET members = $1::text[] WHERE schedule_id = $2 AND user_id = $3 RETURNING *",
      [members, schedule_id, req.user.id]
    );

    // 🔥 5. 同步處理 Payments 表 (新邏輯)
    // 如果有輸入名字，我們要幫他在繳費表「掛號」
    if (name) {
      // 5-1. 先檢查這個學生在這堂課是否已經有繳費紀錄了 (避免重複)
      // 注意：這裡假設你的欄位叫 student_name，如果不是請修改
      const checkPayment = await pool.query(
        "SELECT id FROM payments WHERE schedule_id = $1 AND student_name = $2",
        [schedule_id, name]
      );

      // 5-2. 如果沒資料，才插入一筆新的「未繳」紀錄
      if (checkPayment.rows.length === 0) {
        await pool.query(
          `INSERT INTO payments (schedule_id, student_name, status, amount, created_at) 
           VALUES ($1, $2, '未繳', 0, NOW())`,
          [schedule_id, name]
        );
        console.log(`已自動為學生 ${name} 建立未繳費單據`);
      }
    }

    res.status(200).json({
      success: true,
      message: "座位資料更新成功 (同步更新繳費單)",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("更新座位資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "更新失敗",
      error: error.message,
    });
  }
});

// 取得座位資料
router.get("/seat/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const result = await pool.query(
      "SELECT members FROM class WHERE schedule_id = $1 AND user_id = $2",
      [scheduleId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的課程",
      });
    }

    const members = result.rows[0].members || [];

    // 將字串陣列轉換為物件陣列給前端
    const seatsData = members.map((member) => {
      // 預防資料格式有誤，做個簡單的錯誤處理
      if (!member.includes(":")) return { seat_id: member, name: "" };
      
      const [seat_id, name] = member.split(":");
      return { seat_id, name };
    });

    res.status(200).json({
      success: true,
      data: seatsData,
    });
  } catch (error) {
    console.error("取得座位資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "取得資料失敗",
      error: error.message,
    });
  }
});

module.exports = router;
