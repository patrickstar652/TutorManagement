const HttpError = require("../utils/httpError");

// 負責在 Controller 呼叫 Model 之前，先驗證、轉型和整理前端傳來的資料
const requireString = (value, fieldName) => {
  const parsed = String(value || "").trim();
  if (!parsed) {
    throw new HttpError(400, `${fieldName} is required`, {
      field: fieldName,
    });
  }
  return parsed;
};

const optionalString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const positiveInt = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`, {
      field: fieldName,
    });
  }
  return parsed;
};

const nonNegativeInt = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new HttpError(400, `${fieldName} must be a non-negative integer`, {
      field: fieldName,
    });
  }
  return parsed;
};

const positivePostgresInt = (value, fieldName) => {
  const parsed = positiveInt(value, fieldName);
  if (parsed > 2147483647) {
    throw new HttpError(400, `${fieldName} is too large`, {
      field: fieldName,
    });
  }
  return parsed;
};

const timeString = (value, fieldName) => {
  const parsed = requireString(value, fieldName);
  if (!/^\d{2}:\d{2}$/.test(parsed)) {
    throw new HttpError(400, `${fieldName} must use HH:mm format`, {
      field: fieldName,
    });
  }
  return parsed;
};

const dateString = (value, fieldName) => {
  const parsed = requireString(value, fieldName);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
    throw new HttpError(400, `${fieldName} must use YYYY-MM-DD format`, {
      field: fieldName,
    });
  }

  const parsedDate = new Date(`${parsed}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== parsed
  ) {
    throw new HttpError(400, `${fieldName} must be a valid calendar date`, {
      field: fieldName,
    });
  }

  return parsed;
};

const paymentStatus = (value) => {
  if (["已繳", "paid", "PAID", "Paid"].includes(value)) return "已繳";
  if (["未繳", "unpaid", "UNPAID", "Unpaid"].includes(value)) return "未繳";

  throw new HttpError(400, "status is invalid", {
    field: "status",
    allowedValues: ["已繳", "未繳", "paid", "unpaid"],
  });
};

const weekday = (value) => {
  const parsed = positiveInt(value, "weekday");
  if (parsed > 7) {
    throw new HttpError(400, "weekday must be between 1 and 7", {
      field: "weekday",
    });
  }
  return parsed;
};

const ensureTimeRange = (startTime, endTime) => {
  if (endTime <= startTime) {
    throw new HttpError(400, "end_time must be later than start_time", {
      fields: ["start_time", "end_time"],
    });
  }
};

const optionalTime = (value, remindDate) => {
  const parsed = optionalString(value);
  if (!parsed) return null;
  if (!/^\d{2}:\d{2}$/.test(parsed)) {
    throw new HttpError(400, "remind_at must use HH:mm format", {
      field: "remind_at",
    });
  }
  return `${remindDate} ${parsed}:00`;
};

const loginRequest = (body = {}) => ({
  account: requireString(body.account, "account"),
  password: requireString(body.password, "password"),
});

const courseRequest = (body = {}) => {
  const startTime = timeString(body.start_time, "start_time");
  const endTime = timeString(body.end_time, "end_time");
  ensureTimeRange(startTime, endTime);

  return {
    courseName: requireString(body.course_name, "course_name"),
    endTime,
    startTime,
    weekday: weekday(body.weekday),
  };
};

const scheduleIdParam = (params = {}) => ({
  scheduleId: positiveInt(params.scheduleId, "scheduleId"),
});

const billingPeriodPayload = (body = {}) => {
  const periodStart = dateString(body.periodStart, "periodStart");
  const periodEnd = dateString(body.periodEnd, "periodEnd");

  if (periodEnd < periodStart) {
    throw new HttpError(400, "periodEnd must be on or after periodStart", {
      fields: ["periodStart", "periodEnd"],
    });
  }

  const lessonCount = positivePostgresInt(body.lessonCount, "lessonCount");
  const unitPrice = nonNegativeInt(body.unitPrice, "unitPrice");
  const amountPerStudent = lessonCount * unitPrice;

  if (!Number.isSafeInteger(amountPerStudent)) {
    throw new HttpError(400, "calculated amount is too large", {
      fields: ["lessonCount", "unitPrice"],
    });
  }

  return {
    amountPerStudent,
    lessonCount,
    periodEnd,
    periodStart,
    unitPrice,
  };
};

const billingPeriodCreateRequest = ({ body = {}, params = {} }) => ({
  ...billingPeriodPayload(body),
  scheduleId: positiveInt(params.scheduleId, "scheduleId"),
});

const billingPeriodUpdateRequest = ({ body = {}, params = {} }) => ({
  ...billingPeriodPayload(body),
  periodId: positiveInt(params.periodId, "periodId"),
  scheduleId: positiveInt(params.scheduleId, "scheduleId"),
});

const paymentListRequest = ({ params = {}, query = {} }) => ({
  periodId: query.periodId ? positiveInt(query.periodId, "periodId") : null,
  scheduleId: positiveInt(params.scheduleId, "scheduleId"),
});

const paymentStatusUpdateRequest = ({ body = {}, params = {} }) => ({
  paymentId: positiveInt(params.paymentId, "paymentId"),
  scheduleId: positiveInt(params.scheduleId, "scheduleId"),
  status: paymentStatus(body.status),
});

const reminderCreateRequest = (body = {}) => {
  const remindDate = dateString(body.remind_date, "remind_date");

  return {
    description: optionalString(body.description),
    processedRemindAt: optionalTime(body.remind_at, remindDate),
    remindDate,
    scheduleId: positiveInt(body.schedule_id, "schedule_id"),
    title: requireString(body.title, "title"),
  };
};

const reminderListRequest = (query = {}) => ({
  scheduleId: query.scheduleId ? positiveInt(query.scheduleId, "scheduleId") : null,
});

const reminderIdParam = (params = {}) => ({
  id: positiveInt(params.id, "id"),
});

const seatUpdateRequest = ({ body = {}, params = {} }) => ({
  name: optionalString(body.name),
  scheduleId: positiveInt(
    params.scheduleId || body.schedule_id,
    "schedule_id"
  ),
  seatId: requireString(params.seatId || body.seat_id, "seat_id"),
});

module.exports = {
  billingPeriodCreateRequest,
  billingPeriodUpdateRequest,
  courseRequest,
  loginRequest,
  paymentListRequest,
  paymentStatusUpdateRequest,
  reminderCreateRequest,
  reminderIdParam,
  reminderListRequest,
  scheduleIdParam,
  seatUpdateRequest,
};
