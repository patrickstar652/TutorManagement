const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  courseRequest,
  scheduleIdParam,
} = require("../validators/requestValidators");

router.use(authMiddleware);

const createCourse = asyncHandler(async (req, res) => {
  const { courseName, weekday, startTime, endTime } = courseRequest(req.body);

  const result = await withTransaction(async (client) => {
    const scheduleResult = await client.query(
      `
        INSERT INTO schedule (course_name, weekday, start_time, end_time, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, course_name
      `,
      [courseName, weekday, startTime, endTime, req.user.id]
    );

    const scheduleId = scheduleResult.rows[0].id;

    await client.query(
      "INSERT INTO class (schedule_id, user_id) VALUES ($1, $2)",
      [scheduleId, req.user.id]
    );

    return { schedule_id: scheduleId };
  });

  return success(res, result, { message: "新增課程成功" });
});

const listCourses = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `
      SELECT id, course_name, weekday, start_time, end_time
      FROM schedule
      WHERE user_id = $1
      ORDER BY weekday, start_time
    `,
    [req.user.id]
  );

  return success(res, result.rows);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);

  await withTransaction(async (client) => {
    const own = await client.query(
      "SELECT 1 FROM schedule WHERE id = $1 AND user_id = $2",
      [scheduleId, req.user.id]
    );

    if (own.rowCount === 0) {
      throw new HttpError(403, "無權刪除此課程", null, "COURSE_FORBIDDEN");
    }

    await client.query("DELETE FROM class WHERE schedule_id = $1", [scheduleId]);
    await client.query("DELETE FROM schedule WHERE id = $1", [scheduleId]);
  });

  return success(res, { schedule_id: scheduleId }, { message: "刪除成功" });
});

router.post("/courses", createCourse);
router.get("/courses", listCourses);
router.delete("/courses/:scheduleId", deleteCourse);

router.post("/course", createCourse);
router.get("/showcourse", listCourses);
router.delete("/deletecourse/:scheduleId", deleteCourse);

module.exports = router;
