const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const {
  reminderCreateRequest,
  reminderIdParam,
  reminderListRequest,
} = require("../validators/requestValidators");

router.use(authMiddleware);

router.post(
  "/reminder",
  asyncHandler(async (req, res) => {
    const {
      description,
      processedRemindAt,
      remindDate,
      scheduleId,
      title,
    } = reminderCreateRequest(req.body);

    const scheduleCheck = await pool.query(
      "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
      [scheduleId, req.user.id]
    );

    if (scheduleCheck.rows.length === 0) {
      throw new HttpError(
        403,
        "無權操作此課程或課程不存在",
        null,
        "SCHEDULE_FORBIDDEN"
      );
    }

    const result = await pool.query(
      `
        INSERT INTO reminders (user_id, schedule_id, title, description, remind_at, remind_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [req.user.id, scheduleId, title, description, processedRemindAt, remindDate]
    );

    return success(res, result.rows[0], { message: "新增提醒成功" });
  })
);

router.get(
  "/reminder",
  asyncHandler(async (req, res) => {
    const { scheduleId } = reminderListRequest(req.query);

    let query;
    let params;

    if (scheduleId) {
      query = `
        SELECT r.*, s.course_name
        FROM reminders r
        LEFT JOIN schedule s ON r.schedule_id = s.id
        WHERE r.user_id = $1 AND r.schedule_id = $2
        ORDER BY r.remind_date, r.remind_at
      `;
      params = [req.user.id, scheduleId];
    } else {
      query = `
        SELECT r.*, s.course_name
        FROM reminders r
        LEFT JOIN schedule s ON r.schedule_id = s.id
        WHERE r.user_id = $1
        ORDER BY r.remind_date, r.remind_at
      `;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);

    return success(res, result.rows);
  })
);

router.delete(
  "/reminder/:id",
  asyncHandler(async (req, res) => {
    const { id } = reminderIdParam(req.params);

    const result = await pool.query(
      "DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new HttpError(
        404,
        "提醒不存在或無權限刪除",
        null,
        "REMINDER_NOT_FOUND"
      );
    }

    return success(res, { id }, { message: "刪除提醒成功" });
  })
);

module.exports = router;
