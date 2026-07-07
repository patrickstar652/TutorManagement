const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const ensureClassForSchedule = async (client, scheduleId, userId) => {
  const result = await client.query(
    `
      SELECT c.id, c.schedule_id, c.user_id
      FROM class c
      JOIN schedule s ON s.id = c.schedule_id
      WHERE c.schedule_id = $1
        AND c.user_id = $2
        AND s.user_id = $2
      FOR UPDATE OF c
    `,
    [scheduleId, userId]
  );

  return result.rows[0] || null;
};

const syncLegacyMembers = async (client, classId) => {
  await client.query(
    `
      UPDATE class c
      SET members = COALESCE((
        SELECT array_agg(cm.seat_id || ':' || s.name ORDER BY cm.seat_id)
        FROM class_members cm
        JOIN students s ON s.id = cm.student_id
        WHERE cm.class_id = c.id
      ), ARRAY[]::text[])
      WHERE c.id = $1
    `,
    [classId]
  );
};

router.get("/class", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          c.id AS class_id,
          c.schedule_id,
          s.course_name,
          s.weekday,
          s.start_time,
          s.end_time,
          COUNT(cm.id)::int AS student_count
        FROM class c
        JOIN schedule s ON c.schedule_id = s.id
        LEFT JOIN class_members cm ON cm.class_id = c.id
        WHERE c.user_id = $1
        GROUP BY c.id, c.schedule_id, s.course_name, s.weekday, s.start_time, s.end_time
        ORDER BY s.weekday, s.start_time
      `,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("取得班級失敗：", error);
    return res.status(500).json({ error: "Database query failed" });
  }
});

router.patch("/seat", async (req, res) => {
  const scheduleId = Number(req.body?.schedule_id);
  const seatId = String(req.body?.seat_id || "").trim();
  const name = String(req.body?.name || "").trim();

  if (!scheduleId || !seatId) {
    return res.status(400).json({
      success: false,
      message: "schedule_id 和 seat_id 為必填",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const classRow = await ensureClassForSchedule(client, scheduleId, req.user.id);

    if (!classRow) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "班級不存在或無權限操作",
      });
    }

    if (!name) {
      await client.query(
        "DELETE FROM class_members WHERE class_id = $1 AND seat_id = $2",
        [classRow.id, seatId]
      );
      await syncLegacyMembers(client, classRow.id);
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "座位已清空",
      });
    }

    const studentResult = await client.query(
      `
        INSERT INTO students (user_id, name)
        VALUES ($1, $2)
        ON CONFLICT (user_id, name)
        DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING id, name
      `,
      [req.user.id, name]
    );
    const student = studentResult.rows[0];

    const existingMemberResult = await client.query(
      `
        SELECT id, student_id
        FROM class_members
        WHERE class_id = $1 AND seat_id = $2
      `,
      [classRow.id, seatId]
    );
    const existingMember = existingMemberResult.rows[0] || null;

    let classMemberId;

    if (existingMember?.student_id === student.id) {
      classMemberId = existingMember.id;
      await client.query(
        "UPDATE class_members SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [classMemberId]
      );
    } else {
      await client.query(
        `
          DELETE FROM class_members
          WHERE class_id = $1
            AND (seat_id = $2 OR student_id = $3)
        `,
        [classRow.id, seatId, student.id]
      );

      const memberResult = await client.query(
        `
          INSERT INTO class_members (class_id, student_id, seat_id)
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [classRow.id, student.id, seatId]
      );
      classMemberId = memberResult.rows[0].id;
    }

    const existingPayment = await client.query(
      "SELECT id FROM payments WHERE class_member_id = $1",
      [classMemberId]
    );

    if (existingPayment.rowCount === 0) {
      await client.query(
        `
          INSERT INTO payments (schedule_id, class_member_id, student_name, status, amount)
          VALUES ($1, $2, $3, '未繳', 0)
        `,
        [scheduleId, classMemberId, name]
      );
    } else {
      await client.query(
        `
          UPDATE payments
          SET student_name = $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE class_member_id = $2
        `,
        [name, classMemberId]
      );
    }

    await syncLegacyMembers(client, classRow.id);
    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "座位資料已更新",
      data: { schedule_id: scheduleId, seat_id: seatId, name },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("更新座位失敗：", error);
    return res.status(500).json({
      success: false,
      message: "更新座位失敗",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

router.get("/seat/:scheduleId", async (req, res) => {
  const scheduleId = Number(req.params.scheduleId);

  if (!scheduleId) {
    return res.status(400).json({
      success: false,
      message: "scheduleId 無效",
    });
  }

  try {
    const classResult = await pool.query(
      `
        SELECT c.id
        FROM class c
        JOIN schedule s ON s.id = c.schedule_id
        WHERE c.schedule_id = $1
          AND c.user_id = $2
          AND s.user_id = $2
      `,
      [scheduleId, req.user.id]
    );

    if (classResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "班級不存在或無權限操作",
      });
    }

    const result = await pool.query(
      `
        SELECT cm.seat_id, s.name
        FROM class_members cm
        JOIN students s ON s.id = cm.student_id
        WHERE cm.class_id = $1
        ORDER BY cm.seat_id
      `,
      [classResult.rows[0].id]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("取得座位資料失敗：", error);
    return res.status(500).json({
      success: false,
      message: "取得座位資料失敗",
      error: error.message,
    });
  }
});

module.exports = router;
