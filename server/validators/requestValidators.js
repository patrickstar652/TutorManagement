const HttpError = require("../utils/httpError");

const requireString = (value, fieldName) => {
  const parsed = String(value || "").trim();
  if (!parsed) {
    throw new HttpError(400, `${fieldName} 為必填`, {
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
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} 無效`, {
      field: fieldName,
    });
  }
  return parsed;
};

const nonNegativeInt = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new HttpError(400, `${fieldName} 格式不正確`, {
      field: fieldName,
    });
  }
  return Math.trunc(parsed);
};

const timeString = (value, fieldName) => {
  const parsed = requireString(value, fieldName);
  if (!/^\d{2}:\d{2}$/.test(parsed)) {
    throw new HttpError(400, `${fieldName} 格式不正確`, {
      field: fieldName,
    });
  }
  return parsed;
};

const dateString = (value, fieldName) => {
  const parsed = requireString(value, fieldName);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed)) {
    throw new HttpError(400, `${fieldName} 格式不正確`, {
      field: fieldName,
    });
  }
  return parsed;
};

const paymentStatus = (value) => {
  if (["已繳", "paid", "PAID", "Paid"].includes(value)) return "已繳";
  if (["未繳", "unpaid", "UNPAID", "Unpaid"].includes(value)) return "未繳";
  throw new HttpError(400, "status 格式不正確", {
    field: "status",
    allowedValues: ["已繳", "未繳"],
  });
};

const weekday = (value) => {
  const parsed = positiveInt(value, "weekday");
  if (parsed > 7) {
    throw new HttpError(400, "weekday 必須介於 1 到 7", {
      field: "weekday",
    });
  }
  return parsed;
};

const ensureTimeRange = (startTime, endTime) => {
  if (endTime <= startTime) {
    throw new HttpError(400, "end_time 必須晚於 start_time", {
      fields: ["start_time", "end_time"],
    });
  }
};

const optionalTime = (value, remindDate) => {
  const parsed = optionalString(value);
  if (!parsed) return null;
  if (!/^\d{2}:\d{2}$/.test(parsed)) {
    throw new HttpError(400, "remind_at 格式不正確", {
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

const paymentUpdateRequest = ({ body = {}, params = {} }) => {
  const scheduleId = positiveInt(
    params.scheduleId || body.scheduleId,
    "scheduleId"
  );
  const classMemberId = body.classMemberId
    ? positiveInt(body.classMemberId, "classMemberId")
    : null;
  const student = optionalString(body.student);

  if (!classMemberId && !student) {
    throw new HttpError(400, "classMemberId 或 student 至少需要一個", {
      fields: ["classMemberId", "student"],
    });
  }

  return {
    amount: nonNegativeInt(body.amount, "amount"),
    classMemberId,
    scheduleId,
    status: paymentStatus(body.status),
    student,
  };
};

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
  courseRequest,
  loginRequest,
  paymentUpdateRequest,
  reminderCreateRequest,
  reminderIdParam,
  reminderListRequest,
  scheduleIdParam,
  seatUpdateRequest,
};
