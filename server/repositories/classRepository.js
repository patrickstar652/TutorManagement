const pool = require("../db");

const getClassesByUserId = async (userId) => {
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
    [userId]
  );

  return result.rows;
};

const findClassByScheduleForUser = async (db, scheduleId, userId, options = {}) => {
  const lockClause = options.forUpdate ? "FOR UPDATE OF c" : "";
  const result = await db.query(
    `
      SELECT c.id, c.schedule_id, c.user_id
      FROM class c
      JOIN schedule s ON s.id = c.schedule_id
      WHERE c.schedule_id = $1
        AND c.user_id = $2
        AND s.user_id = $2
      ${lockClause}
    `,
    [scheduleId, userId]
  );

  return result.rows[0] || null;
};

const getSeatMembersByClassId = async (classId) => {
  const result = await pool.query(
    `
      SELECT cm.seat_id, s.name
      FROM class_members cm
      JOIN students s ON s.id = cm.student_id
      WHERE cm.class_id = $1
      ORDER BY cm.seat_id
    `,
    [classId]
  );

  return result.rows;
};

const deleteClassMemberBySeat = async (db, classId, seatId) => {
  await db.query(
    "DELETE FROM class_members WHERE class_id = $1 AND seat_id = $2",
    [classId, seatId]
  );
};

const upsertStudent = async (db, userId, name) => {
  const result = await db.query(
    `
      INSERT INTO students (user_id, name)
      VALUES ($1, $2)
      ON CONFLICT (user_id, name)
      DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id, name
    `,
    [userId, name]
  );

  return result.rows[0];
};

const findClassMemberBySeat = async (db, classId, seatId) => {
  const result = await db.query(
    `
      SELECT id, student_id
      FROM class_members
      WHERE class_id = $1 AND seat_id = $2
    `,
    [classId, seatId]
  );

  return result.rows[0] || null;
};

const touchClassMember = async (db, classMemberId) => {
  await db.query(
    "UPDATE class_members SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
    [classMemberId]
  );
};

const deleteConflictingClassMembers = async (db, classId, seatId, studentId) => {
  await db.query(
    `
      DELETE FROM class_members
      WHERE class_id = $1
        AND (seat_id = $2 OR student_id = $3)
    `,
    [classId, seatId, studentId]
  );
};

const createClassMember = async (db, classId, studentId, seatId) => {
  const result = await db.query(
    `
      INSERT INTO class_members (class_id, student_id, seat_id)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [classId, studentId, seatId]
  );

  return result.rows[0];
};

const findPaymentByClassMemberId = async (db, classMemberId) => {
  const result = await db.query(
    "SELECT id FROM payments WHERE class_member_id = $1",
    [classMemberId]
  );

  return result.rows[0] || null;
};

const createInitialPayment = async (db, scheduleId, classMemberId, studentName) => {
  await db.query(
    `
      INSERT INTO payments (schedule_id, class_member_id, student_name, status, amount)
      VALUES ($1, $2, $3, '未繳', 0)
    `,
    [scheduleId, classMemberId, studentName]
  );
};

const updatePaymentStudentName = async (db, classMemberId, studentName) => {
  await db.query(
    `
      UPDATE payments
      SET student_name = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE class_member_id = $2
    `,
    [studentName, classMemberId]
  );
};

module.exports = {
  createClassMember,
  createInitialPayment,
  deleteClassMemberBySeat,
  deleteConflictingClassMembers,
  findClassByScheduleForUser,
  findClassMemberBySeat,
  findPaymentByClassMemberId,
  getClassesByUserId,
  getSeatMembersByClassId,
  touchClassMember,
  updatePaymentStudentName,
  upsertStudent,
};
