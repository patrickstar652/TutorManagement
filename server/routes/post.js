const express = require("express");
const router = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const pool = require("../db");

/** JWT 驗證：token 需含 { id, account } */
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Token 未提供" });

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

router.use(authMiddleware);

/**
 * POST /course
 * 新增課程到 schedule，並同步建立一筆 class（帶入 course_name）
 * Body: { course_name, weekday, start_time, end_time, note? }
 */
router.post("/course", async (req, res) => {
  const { course_name, weekday, start_time, end_time } = req.body || {};

  if (!course_name || !weekday || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "course_name、weekday、start_time、end_time 為必填",
    });
  }

  try {
    await pool.query("BEGIN");

    // 1) 建立 schedule，允許同名課程
    const insScheduleSql = `
      INSERT INTO schedule (course_name, weekday, start_time, end_time, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, course_name
    `;
    const sRes = await pool.query(insScheduleSql, [
      course_name,
      Number(weekday),
      start_time,
      end_time,
      req.user.id,
    ]);
    const scheduleId = sRes.rows[0].id;
    const returnedCourseName = sRes.rows[0].course_name;

    // 2) 同步建立 class，加上 user_id
    await pool.query(
      `INSERT INTO class (schedule_id, user_id) VALUES ($1, $2)`,
      [scheduleId, req.user.id]
    );

    await pool.query("COMMIT");
    return res.status(200).json({
      success: true,
      message: "新增課程成功",
      schedule_id: scheduleId,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("新增課程失敗：", err);
    console.error("錯誤代碼：", err.code);
    console.error("約束名稱：", err.constraint);
    
    return res.status(500).json({ 
      success: false, 
      message: "新增失敗", 
      error: err.message 
    });
  }
});

/**
 * GET /showcourse
 * 取得目前登入老師的所有課程（純 schedule）
 * 回傳欄位：id, course_name, weekday, start_time, end_time, note
 */
router.get("/showcourse", async (req, res) => {
  try {
    const sql = `
      SELECT id, course_name, weekday, start_time, end_time
      FROM schedule
      WHERE user_id = $1
      ORDER BY weekday, start_time
    `;
    const result = await pool.query(sql, [req.user.id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("查詢課程失敗：", err);
    return res.status(500).json({ error: "Database query failed" });
  }
});

/**
 * DELETE /deletecourse/:scheduleId
 * 刪除單一課程（先刪 class，再刪 schedule），只允許刪自己的
 */
router.delete("/deletecourse/:scheduleId", async (req, res) => {
  const scheduleId = Number(req.params.scheduleId || 0);
  if (!scheduleId) return res.status(400).json({ error: "scheduleId 無效" });

  try {
    await pool.query("BEGIN");

    // 只能刪自己的課
    const own = await pool.query(
      "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
      [scheduleId, req.user.id]
    );
    if (own.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(403).json({ error: "無權刪除此課程" });
    }

    // 先刪 class，再刪 schedule
    await pool.query("DELETE FROM class WHERE schedule_id = $1", [scheduleId]);
    await pool.query("DELETE FROM schedule WHERE id = $1", [scheduleId]);

    await pool.query("COMMIT");
    return res.status(200).json({ success: true, message: "刪除成功" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("刪除課程失敗：", err);
    return res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
