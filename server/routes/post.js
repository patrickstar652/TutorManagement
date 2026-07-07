const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.post("/course", async (req, res) => {
  const { course_name, weekday, start_time, end_time } = req.body || {};

  if (!course_name || !weekday || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "course_name、weekday、start_time、end_time 為必填",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const scheduleResult = await client.query(
      `
        INSERT INTO schedule (course_name, weekday, start_time, end_time, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, course_name
      `,
      [course_name, Number(weekday), start_time, end_time, req.user.id]
    );

    const scheduleId = scheduleResult.rows[0].id;

    await client.query(
      "INSERT INTO class (schedule_id, user_id) VALUES ($1, $2)",
      [scheduleId, req.user.id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "新增課程成功",
      schedule_id: scheduleId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("新增課程失敗：", error);

    return res.status(500).json({
      success: false,
      message: "新增失敗",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

router.get("/showcourse", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT id, course_name, weekday, start_time, end_time
        FROM schedule
        WHERE user_id = $1
        ORDER BY weekday, start_time
      `,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("取得課程失敗：", error);
    return res.status(500).json({ error: "Database query failed" });
  }
});

router.delete("/deletecourse/:scheduleId", async (req, res) => {
  const scheduleId = Number(req.params.scheduleId || 0);

  if (!scheduleId) {
    return res.status(400).json({ error: "scheduleId 無效" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const own = await client.query(
      "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
      [scheduleId, req.user.id]
    );

    if (own.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "無權刪除此課程" });
    }

    await client.query("DELETE FROM class WHERE schedule_id = $1", [scheduleId]);
    await client.query("DELETE FROM schedule WHERE id = $1", [scheduleId]);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "刪除成功",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("刪除課程失敗：", error);
    return res.status(500).json({ error: "Database query failed" });
  } finally {
    client.release();
  }
});

module.exports = router;
