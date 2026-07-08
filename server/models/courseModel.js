const pool = require("../db");

const createSchedule = async (
  db,
  { courseName, weekday, startTime, endTime, userId }
) => {
  const result = await db.query(
    `
      INSERT INTO schedule (course_name, weekday, start_time, end_time, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, course_name
    `,
    [courseName, weekday, startTime, endTime, userId]
  );

  return result.rows[0];
};

const createClass = async (db, { scheduleId, userId }) => {
  await db.query("INSERT INTO class (schedule_id, user_id) VALUES ($1, $2)", [
    scheduleId,
    userId,
  ]);
};

const listByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT id, course_name, weekday, start_time, end_time
      FROM schedule
      WHERE user_id = $1
      ORDER BY weekday, start_time
    `,
    [userId]
  );

  return result.rows;
};

const findOwnedSchedule = async (db, { scheduleId, userId }) => {
  const result = await db.query(
    "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
    [scheduleId, userId]
  );

  return result.rows[0] || null;
};

const deleteClassBySchedule = async (db, scheduleId) => {
  await db.query("DELETE FROM class WHERE schedule_id = $1", [scheduleId]);
};

const deleteSchedule = async (db, scheduleId) => {
  await db.query("DELETE FROM schedule WHERE id = $1", [scheduleId]);
};

module.exports = {
  createClass,
  createSchedule,
  deleteClassBySchedule,
  deleteSchedule,
  findOwnedSchedule,
  listByUserId,
};
