const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  paymentUpdateRequest,
  scheduleIdParam,
} = require("../validators/requestValidators");

router.use(authMiddleware);

const updatePayment = asyncHandler(async (req, res) => {
  const { amount, classMemberId, scheduleId, status, student } =
    paymentUpdateRequest({
      body: req.body,
      params: req.params,
    });

  const payment = await withTransaction(async (client) => {
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
      throw new HttpError(
        404,
        "找不到學生或無權限更新",
        null,
        "PAYMENT_MEMBER_NOT_FOUND"
      );
    }

    const member = memberResult.rows[0];

    const existingPayment = await client.query(
      "SELECT id FROM payments WHERE class_member_id = $1",
      [member.class_member_id]
    );

    if (existingPayment.rowCount === 0) {
      const result = await client.query(
        `
          INSERT INTO payments (schedule_id, class_member_id, student_name, amount, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
        [scheduleId, member.class_member_id, member.student_name, amount, status]
      );

      return result.rows[0];
    }

    const result = await client.query(
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

    return result.rows[0];
  });

  return success(res, payment, { message: "更新成功" });
});

const listPayments = asyncHandler(async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);

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

  return success(res, result.rows);
});

router.patch("/classes/:scheduleId/payments", updatePayment);
router.get("/classes/:scheduleId/payments", listPayments);

router.patch("/payment", updatePayment);
router.get("/payment/:scheduleId", listPayments);

module.exports = router;
