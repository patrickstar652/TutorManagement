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

router.patch("/seat", async (req, res) => {
  const { schedule_id, seat_id, name } = req.body;

  try {
    // 驗證必要欄位
    if (!schedule_id || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "schedule_id 和 seat_id 是必要欄位",
      });
    }

    // 先取得現有的 members 陣列並檢查權限
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

    // 取得現有的 members 陣列，如果為 null 則建立空陣列
    let members = currentResult.rows[0].members || [];

    // 建立新的座位字串格式: "seat_id:name"
    const seatString = `${seat_id}:${name || ""}`;

    // 檢查是否已存在該座位
    const existingIndex = members.findIndex((member) =>
      member.startsWith(`${seat_id}:`)
    );

    if (existingIndex >= 0) {
      // 更新現有座位
      members[existingIndex] = seatString;
    } else {
      // 新增座位
      members.push(seatString);
    }

    // 更新資料庫，使用 PostgreSQL 陣列語法
    const result = await pool.query(
      "UPDATE class SET members = $1::text[] WHERE schedule_id = $2 AND user_id = $3 RETURNING *",
      [members, schedule_id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "座位資料更新成功",
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

    // 將字串陣列轉換為物件陣列
    const seatsData = members.map((member) => {
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