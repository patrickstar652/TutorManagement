const pool = require("../db");

const findClassMemberForPayment = async (
  db,
  { scheduleId, userId, classMemberId, student }
) => {
  const result = await db.query(
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
    [scheduleId, userId, classMemberId, student]
  );

  return result.rows[0] || null;
};

const findByClassMemberId = async (db, classMemberId) => {
  const result = await db.query(
    "SELECT id FROM payments WHERE class_member_id = $1",
    [classMemberId]
  );

  return result.rows[0] || null;
};

const createPayment = async (
  db,
  { scheduleId, classMemberId, studentName, amount, status }
) => {
  const result = await db.query(
    `
      INSERT INTO payments (schedule_id, class_member_id, student_name, amount, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [scheduleId, classMemberId, studentName, amount, status]
  );

  return result.rows[0];
};

const updatePayment = async (
  db,
  { classMemberId, studentName, amount, status }
) => {
  const result = await db.query(
    `
      UPDATE payments
      SET amount = $1,
          status = $2,
          student_name = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE class_member_id = $4
      RETURNING *
    `,
    [amount, status, studentName, classMemberId]
  );

  return result.rows[0];
};

const listBySchedule = async ({ scheduleId, userId }) => {
  const result = await pool.query(
    `
      SELECT
        p.id,
        $1::int AS schedule_id,
        cm.id AS class_member_id,
        cm.seat_id,
        COALESCE(p.student_name, s.name) AS student_name,
        COALESCE(p.amount, 0) AS amount,
        COALESCE(p.status, $3) AS status,
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
    [scheduleId, userId, "未繳"]
  );

  return result.rows;
};

module.exports = {
  createPayment,
  findByClassMemberId,
  findClassMemberForPayment,
  listBySchedule,
  updatePayment,
};
