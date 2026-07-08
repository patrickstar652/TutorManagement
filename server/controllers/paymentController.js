const paymentModel = require("../models/paymentModel");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  paymentUpdateRequest,
  scheduleIdParam,
} = require("../validators/requestValidators");

const updatePayment = async (req, res) => {
  const { amount, classMemberId, scheduleId, status, student } =
    paymentUpdateRequest({
      body: req.body,
      params: req.params,
    });

  const payment = await withTransaction(async (client) => {
    const member = await paymentModel.findClassMemberForPayment(client, {
      scheduleId,
      userId: req.user.id,
      classMemberId,
      student,
    });

    if (!member) {
      throw new HttpError(
        404,
        "Payment member not found",
        null,
        "PAYMENT_MEMBER_NOT_FOUND"
      );
    }

    const existingPayment = await paymentModel.findByClassMemberId(
      client,
      member.class_member_id
    );

    if (!existingPayment) {
      return paymentModel.createPayment(client, {
        scheduleId,
        classMemberId: member.class_member_id,
        studentName: member.student_name,
        amount,
        status,
      });
    }

    return paymentModel.updatePayment(client, {
      classMemberId: member.class_member_id,
      studentName: member.student_name,
      amount,
      status,
    });
  });

  return success(res, payment, { message: "Payment updated" });
};

const listPayments = async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);
  const payments = await paymentModel.listBySchedule({
    scheduleId,
    userId: req.user.id,
  });

  return success(res, payments);
};

module.exports = {
  listPayments,
  updatePayment,
};
