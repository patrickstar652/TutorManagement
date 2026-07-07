const classRepository = require("../repositories/classRepository");
const pool = require("../db");
const HttpError = require("../utils/httpError");
const withTransaction = require("../utils/transaction");

const listClasses = async (userId) => {
  return classRepository.getClassesByUserId(userId);
};

const getSeats = async ({ scheduleId, userId }) => {
  const classRow = await classRepository.findClassByScheduleForUser(
    pool,
    scheduleId,
    userId
  );

  if (!classRow) {
    throw new HttpError(404, "班級不存在或無權限操作");
  }

  return classRepository.getSeatMembersByClassId(classRow.id);
};

const updateSeat = async ({ scheduleId, seatId, name, userId }) => {
  return withTransaction(async (client) => {
    const classRow = await classRepository.findClassByScheduleForUser(
      client,
      scheduleId,
      userId,
      { forUpdate: true }
    );

    if (!classRow) {
      throw new HttpError(404, "班級不存在或無權限操作");
    }

    if (!name) {
      await classRepository.deleteClassMemberBySeat(client, classRow.id, seatId);

      return {
        message: "座位已清空",
        data: null,
      };
    }

    const student = await classRepository.upsertStudent(client, userId, name);
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
      message: "座位資料已更新",
      data: { schedule_id: scheduleId, seat_id: seatId, name: student.name },
    };
  });
};

const assignSeatToStudent = async ({ client, classId, seatId, studentId }) => {
  const existingMember = await classRepository.findClassMemberBySeat(
    client,
    classId,
    seatId
  );

  if (existingMember?.student_id === studentId) {
    await classRepository.touchClassMember(client, existingMember.id);
    return existingMember.id;
  }

  await classRepository.deleteConflictingClassMembers(
    client,
    classId,
    seatId,
    studentId
  );

  const member = await classRepository.createClassMember(
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
  const payment = await classRepository.findPaymentByClassMemberId(
    client,
    classMemberId
  );

  if (!payment) {
    await classRepository.createInitialPayment(
      client,
      scheduleId,
      classMemberId,
      studentName
    );
    return;
  }

  await classRepository.updatePaymentStudentName(
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
