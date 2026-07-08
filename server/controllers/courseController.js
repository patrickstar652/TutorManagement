const courseModel = require("../models/courseModel");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  courseRequest,
  scheduleIdParam,
} = require("../validators/requestValidators");

const createCourse = async (req, res) => {
  const { courseName, weekday, startTime, endTime } = courseRequest(req.body);

  const result = await withTransaction(async (client) => {
    const schedule = await courseModel.createSchedule(client, {
      courseName,
      weekday,
      startTime,
      endTime,
      userId: req.user.id,
    });

    await courseModel.createClass(client, {
      scheduleId: schedule.id,
      userId: req.user.id,
    });

    return { schedule_id: schedule.id };
  });

  return success(res, result, { message: "Course created" });
};

const listCourses = async (req, res) => {
  const courses = await courseModel.listByUserId(req.user.id);
  return success(res, courses);
};

const deleteCourse = async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);

  await withTransaction(async (client) => {
    const ownedSchedule = await courseModel.findOwnedSchedule(client, {
      scheduleId,
      userId: req.user.id,
    });

    if (!ownedSchedule) {
      throw new HttpError(403, "Course forbidden", null, "COURSE_FORBIDDEN");
    }

    await courseModel.deleteClassBySchedule(client, scheduleId);
    await courseModel.deleteSchedule(client, scheduleId);
  });

  return success(res, { schedule_id: scheduleId }, { message: "Course deleted" });
};

module.exports = {
  createCourse,
  deleteCourse,
  listCourses,
};
