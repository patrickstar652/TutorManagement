const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const normalizeStatus = (status) => {
  if (["已繳", "paid", "PAID", "Paid"].includes(status)) return "已繳";
  if (["未繳", "unpaid", "UNPAID", "Unpaid"].includes(status)) return "未繳";
  return null;
};

const normalizeAmount = (amount) => {
  const value = Number(amount);
  return Number.isFinite(value) && value >= 0 ? Math.trunc(value) : null;
};

router.patch("/payment", async (req, res) => {
  const scheduleId = Number(req.body?.scheduleId);
  const classMemberId = req.body?.classMemberId ? Number(req.body.classMemberId) : null;
  const student = String(req.body?.student || "").trim();
  const amount = normalizeAmount(req.body?.amount);
  const status = normalizeStatus(req.body?.status);

  if (!scheduleId || (!classMemberId && !student)) {
    return res.status(400).json({ message: "scheduleId 與學生資料為必填" });
  }

  if (amount === null || !status) {
    return res.status(400).json({ message: "amount 或 status 格式不正確" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const memberResult = await client.query(
      `
        SELECT cm.id AS class_member_id, s.name AS student_name
        FROM class c
        JOIN schedule sch ON sch.id = c.schedule_id
        JOIN class_members cm ON cm.class_id = c.id
        JOIN students s ON s.id = cm.student_id
        WHERE c.schedule_id = $1
          AND c.user_id = $2
          AND sch.user_id = $2
          AND ($3::int IS NULL OR cm.id = $3::int)
          AND ($4::text = '' OR s.name = $4::text)
        ORDER BY cm.id
        LIMIT 1
      `,
      [scheduleId, req.user.id, classMemberId, student]
    );

    if (memberResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "找不到學生或無權限更新" });
    }

    const member = memberResult.rows[0];

    const existingPayment = await client.query(
      "SELECT id FROM payments WHERE class_member_id = $1",
      [member.class_member_id]
    );

    let result;

    if (existingPayment.rowCount === 0) {
      result = await client.query(
        `
          INSERT INTO payments (schedule_id, class_member_id, student_name, amount, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [scheduleId, member.class_member_id, member.student_name, amount, status]
      );
    } else {
      result = await client.query(
        `
          UPDATE payments
          SET amount = $1,
              status = $2,
              student_name = $3,
              updated_at = CURRENT_TIMESTAMP
          WHERE class_member_id = $4
          RETURNING *
        `,
        [amount, status, member.student_name, member.class_member_id]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({
      message: "更新成功",
      data: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("更新繳費資料失敗：", error);
    return res.status(500).json({ message: "更新失敗" });
  } finally {
    client.release();
  }
});

router.get("/payment/:scheduleId", async (req, res) => {
  const scheduleId = Number(req.params.scheduleId);

  if (!scheduleId) {
    return res.status(400).json({ message: "scheduleId 無效" });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          $1::int AS schedule_id,
          cm.id AS class_member_id,
          cm.seat_id,
          COALESCE(p.student_name, s.name) AS student_name,
          COALESCE(p.amount, 0) AS amount,
          COALESCE(p.status, '未繳') AS status,
          COALESCE(p.created_at, cm.created_at) AS created_at,
          p.updated_at
        FROM class c
        JOIN schedule sch ON sch.id = c.schedule_id
        JOIN class_members cm ON cm.class_id = c.id
        JOIN students s ON s.id = cm.student_id
        LEFT JOIN payments p ON p.class_member_id = cm.id
        WHERE c.schedule_id = $1
          AND c.user_id = $2
          AND sch.user_id = $2
        ORDER BY cm.seat_id
      `,
      [scheduleId, req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("取得繳費資料失敗：", error);
    return res.status(500).json({ message: "取得失敗" });
  }
});

module.exports = router;
