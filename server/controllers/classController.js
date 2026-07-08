const classModel = require("../models/classModel");
const pool = require("../db");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  scheduleIdParam,
  seatUpdateRequest,
} = require("../validators/requestValidators");

const listClasses = async (req, res) => {
  const classes = await classModel.getClassesByUserId(req.user.id);
  return success(res, classes);
};

const updateSeat = async (req, res) => {
  const { name, scheduleId, seatId } = seatUpdateRequest({
    body: req.body,
    params: req.params,
  });

  const result = await updateSeatForClass({
    scheduleId,
    seatId,
    name,
    userId: req.user.id,
  });

  return success(res, result.data, {
    message: result.message,
  });
};

const getSeats = async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);
  const classRow = await classModel.findClassByScheduleForUser(
    pool,
    scheduleId,
    req.user.id
  );

  if (!classRow) {
    throw new HttpError(404, "Class not found", null, "CLASS_NOT_FOUND");
  }

  const seats = await classModel.getSeatMembersByClassId(classRow.id);

  return success(res, seats);
};

const updateSeatForClass = async ({ scheduleId, seatId, name, userId }) => {
  return withTransaction(async (client) => {
    const classRow = await classModel.findClassByScheduleForUser(
      client,
      scheduleId,
      userId,
      { forUpdate: true }
    );

    if (!classRow) {
      throw new HttpError(404, "Class not found", null, "CLASS_NOT_FOUND");
    }

    if (!name) {
      await classModel.deleteClassMemberBySeat(client, classRow.id, seatId);

      return {
        message: "Seat cleared",
        data: null,
      };
    }

    const student = await classModel.upsertStudent(client, userId, name);
    const classMemberId = await assignSeatToStudent({
      client,
      classId: classRow.id,
      seatId,
      studentId: student.id,
    });

    await ensurePaymentForClassMember({
      client,
      scheduleId,
      classMemberId,
      studentName: student.name,
    });

    return {
      message: "Seat updated",
      data: { schedule_id: scheduleId, seat_id: seatId, name: student.name },
    };
  });
};

const assignSeatToStudent = async ({ client, classId, seatId, studentId }) => {
  const existingMember = await classModel.findClassMemberBySeat(
    client,
    classId,
    seatId
  );

  if (existingMember?.student_id === studentId) {
    await classModel.touchClassMember(client, existingMember.id);
    return existingMember.id;
  }

  await classModel.deleteConflictingClassMembers(
    client,
    classId,
    seatId,
    studentId
  );

  const member = await classModel.createClassMember(
    client,
    classId,
    studentId,
    seatId
  );

  return member.id;
};

const ensurePaymentForClassMember = async ({
  client,
  scheduleId,
  classMemberId,
  studentName,
}) => {
  const payment = await classModel.findPaymentByClassMemberId(
    client,
    classMemberId
  );

  if (!payment) {
    await classModel.createInitialPayment(
      client,
      scheduleId,
      classMemberId,
      studentName
    );
    return;
  }

  await classModel.updatePaymentStudentName(
    client,
    classMemberId,
    studentName
  );
};

module.exports = {
  getSeats,
  listClasses,
  updateSeat,
};
