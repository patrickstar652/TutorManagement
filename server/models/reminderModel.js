const pool = require("../db");

const findOwnedSchedule = async ({ scheduleId, userId }) => {
  const result = await pool.query(
    "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
    [scheduleId, userId]
  );

  return result.rows[0] || null;
};

const createReminder = async ({
  userId,
  scheduleId,
  title,
  description,
  processedRemindAt,
  remindDate,
}) => {
  const result = await pool.query(
    `
      INSERT INTO reminders (user_id, schedule_id, title, description, remind_at, remind_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [userId, scheduleId, title, description, processedRemindAt, remindDate]
  );

  return result.rows[0];
};

const listByUserId = async ({ userId, scheduleId }) => {
  const params = scheduleId ? [userId, scheduleId] : [userId];
  const scheduleFilter = scheduleId ? "AND r.schedule_id = $2" : "";
  const result = await pool.query(
    `
      SELECT r.*, s.course_name
      FROM reminders r
      LEFT JOIN schedule s ON r.schedule_id = s.id
      WHERE r.user_id = $1
      ${scheduleFilter}
      ORDER BY r.remind_date, r.remind_at
    `,
    params
  );

  return result.rows;
};

const deleteByIdForUser = async ({ id, userId }) => {
  const result = await pool.query(
    "DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );

  return result.rows[0] || null;
};

module.exports = {
  createReminder,
  deleteByIdForUser,
  findOwnedSchedule,
  listByUserId,
};
