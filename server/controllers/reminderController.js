const reminderModel = require("../models/reminderModel");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const {
  reminderCreateRequest,
  reminderIdParam,
  reminderListRequest,
} = require("../validators/requestValidators");

const createReminder = async (req, res) => {
  const {
    description,
    processedRemindAt,
    remindDate,
    scheduleId,
    title,
  } = reminderCreateRequest(req.body);

  const ownedSchedule = await reminderModel.findOwnedSchedule({
    scheduleId,
    userId: req.user.id,
  });

  if (!ownedSchedule) {
    throw new HttpError(403, "Schedule forbidden", null, "SCHEDULE_FORBIDDEN");
  }

  const reminder = await reminderModel.createReminder({
    userId: req.user.id,
    scheduleId,
    title,
    description,
    processedRemindAt,
    remindDate,
  });

  return success(res, reminder, { message: "Reminder created" });
};

const listReminders = async (req, res) => {
  const { scheduleId } = reminderListRequest(req.query);
  const reminders = await reminderModel.listByUserId({
    userId: req.user.id,
    scheduleId,
  });

  return success(res, reminders);
};

const deleteReminder = async (req, res) => {
  const { id } = reminderIdParam(req.params);
  const reminder = await reminderModel.deleteByIdForUser({
    id,
    userId: req.user.id,
  });

  if (!reminder) {
    throw new HttpError(404, "Reminder not found", null, "REMINDER_NOT_FOUND");
  }

  return success(res, { id }, { message: "Reminder deleted" });
};

module.exports = {
  createReminder,
  deleteReminder,
  listReminders,
};
