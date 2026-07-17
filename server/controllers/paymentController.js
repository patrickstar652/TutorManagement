const pool = require("../db");
const paymentModel = require("../models/paymentModel");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const withTransaction = require("../utils/transaction");
const {
  billingPeriodCreateRequest,
  billingPeriodUpdateRequest,
  paymentListRequest,
  paymentStatusUpdateRequest,
} = require("../validators/requestValidators");

const emptySummary = () => ({
  paid_count: 0,
  total_collected: 0,
  total_due: 0,
  total_outstanding: 0,
  total_students: 0,
  unpaid_count: 0,
});

const periodSummary = (period) => ({
  paid_count: period.paid_count,
  total_collected: period.total_collected,
  total_due: period.total_due,
  total_outstanding: period.total_outstanding,
  total_students: period.total_students,
  unpaid_count: period.unpaid_count,
});

const withEditState = (period) => ({
  ...period,
  can_edit: period.paid_count === 0,
});

const loadPaymentOverview = async (
  db,
  { periodId = null, scheduleId, userId }
) => {
  const periods = await paymentModel.listPeriods(db, { scheduleId, userId });
  const selectedPeriod = periodId
    ? periods.find((period) => period.id === periodId)
    : periods[0];

  if (periodId && !selectedPeriod) {
    throw new HttpError(
      404,
      "找不到收費期別",
      null,
      "BILLING_PERIOD_NOT_FOUND"
    );
  }

  if (!selectedPeriod) {
    return {
      current_period: null,
      payments: [],
      periods: [],
      summary: emptySummary(),
    };
  }

  const payments = await paymentModel.listPaymentsByPeriod(db, {
    periodId: selectedPeriod.id,
    scheduleId,
    userId,
  });

  return {
    current_period: withEditState(selectedPeriod),
    payments,
    periods: periods.map(withEditState),
    summary: periodSummary(selectedPeriod),
  };
};

const ensureOwnedClass = async (
  db,
  { scheduleId, userId, forUpdate = false }
) => {
  const classRow = await paymentModel.findOwnedClass(db, {
    scheduleId,
    userId,
    forUpdate,
  });

  if (!classRow) {
    throw new HttpError(404, "找不到班級", null, "CLASS_NOT_FOUND");
  }

  return classRow;
};

const translatePeriodConstraintError = (error) => {
  if (error.code === "23P01" || error.code === "23505") {
    return new HttpError(
      409,
      "收費期別與現有期別的日期重疊",
      null,
      "BILLING_PERIOD_OVERLAP"
    );
  }

  return error;
};

const listPayments = async (req, res) => {
  const { periodId, scheduleId } = paymentListRequest({
    params: req.params,
    query: req.query,
  });

  const overview = await withTransaction(async (client) => {
    await client.query(
      "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY"
    );
    await ensureOwnedClass(client, {
      scheduleId,
      userId: req.user.id,
    });

    return loadPaymentOverview(client, {
      periodId,
      scheduleId,
      userId: req.user.id,
    });
  });

  return success(res, overview);
};

const createBillingPeriod = async (req, res) => {
  const payload = billingPeriodCreateRequest({
    body: req.body,
    params: req.params,
  });

  let overview;
  try {
    overview = await withTransaction(async (client) => {
      const classRow = await ensureOwnedClass(client, {
        scheduleId: payload.scheduleId,
        userId: req.user.id,
        forUpdate: true,
      });

      const overlap = await paymentModel.findOverlappingPeriod(client, payload);
      if (overlap) {
        throw new HttpError(
          409,
          "收費期別與現有期別的日期重疊",
          null,
          "BILLING_PERIOD_OVERLAP"
        );
      }

      const period = await paymentModel.createBillingPeriod(client, payload);
      const paymentCount = await paymentModel.createPaymentsForPeriod(client, {
        amountDue: payload.amountPerStudent,
        classId: classRow.class_id,
        periodId: period.id,
      });

      if (paymentCount === 0) {
        throw new HttpError(
          409,
          "請先在班級中加入至少一位學生，再建立收費期別",
          null,
          "BILLING_PERIOD_EMPTY_CLASS"
        );
      }

      return loadPaymentOverview(client, {
        periodId: period.id,
        scheduleId: payload.scheduleId,
        userId: req.user.id,
      });
    });
  } catch (error) {
    throw translatePeriodConstraintError(error);
  }

  return success(res, overview, {
    message: "收費期別已建立",
    statusCode: 201,
  });
};

const updateBillingPeriod = async (req, res) => {
  const payload = billingPeriodUpdateRequest({
    body: req.body,
    params: req.params,
  });

  let overview;
  try {
    overview = await withTransaction(async (client) => {
      await ensureOwnedClass(client, {
        scheduleId: payload.scheduleId,
        userId: req.user.id,
        forUpdate: true,
      });

      const period = await paymentModel.findOwnedPeriod(client, {
        periodId: payload.periodId,
        scheduleId: payload.scheduleId,
        userId: req.user.id,
        forUpdate: true,
      });

      if (!period) {
        throw new HttpError(
          404,
          "找不到收費期別",
          null,
          "BILLING_PERIOD_NOT_FOUND"
        );
      }

      if (await paymentModel.hasPaidPayments(client, period.id)) {
        throw new HttpError(
          409,
          "已有學生標記為已繳，無法修改此收費期別",
          null,
          "BILLING_PERIOD_LOCKED"
        );
      }

      const overlap = await paymentModel.findOverlappingPeriod(client, {
        ...payload,
        excludePeriodId: payload.periodId,
      });
      if (overlap) {
        throw new HttpError(
          409,
          "收費期別與現有期別的日期重疊",
          null,
          "BILLING_PERIOD_OVERLAP"
        );
      }

      await paymentModel.updateBillingPeriod(client, payload);
      await paymentModel.updatePaymentAmounts(client, {
        amountDue: payload.amountPerStudent,
        periodId: payload.periodId,
      });

      return loadPaymentOverview(client, {
        periodId: payload.periodId,
        scheduleId: payload.scheduleId,
        userId: req.user.id,
      });
    });
  } catch (error) {
    throw translatePeriodConstraintError(error);
  }

  return success(res, overview, { message: "收費期別已更新" });
};

const updatePaymentStatus = async (req, res) => {
  const { paymentId, scheduleId, status } = paymentStatusUpdateRequest({
    body: req.body,
    params: req.params,
  });

  const overview = await withTransaction(async (client) => {
    await ensureOwnedClass(client, {
      scheduleId,
      userId: req.user.id,
      forUpdate: true,
    });

    const payment = await paymentModel.findOwnedPayment(client, {
      paymentId,
      scheduleId,
      userId: req.user.id,
      forUpdate: true,
    });

    if (!payment) {
      throw new HttpError(
        404,
        "找不到繳費資料",
        null,
        "PAYMENT_NOT_FOUND"
      );
    }

    await paymentModel.updatePaymentStatus(client, { paymentId, status });

    return loadPaymentOverview(client, {
      periodId: payment.billing_period_id,
      scheduleId,
      userId: req.user.id,
    });
  });

  return success(res, overview, { message: "繳費狀態已更新" });
};

module.exports = {
  createBillingPeriod,
  listPayments,
  updateBillingPeriod,
  updatePaymentStatus,
};
