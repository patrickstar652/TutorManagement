const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

router.use(authMiddleware);

router.get(
  "/classes/:scheduleId/payments",
  asyncHandler(paymentController.listPayments)
);
router.post(
  "/classes/:scheduleId/billing-periods",
  asyncHandler(paymentController.createBillingPeriod)
);
router.patch(
  "/classes/:scheduleId/billing-periods/:periodId",
  asyncHandler(paymentController.updateBillingPeriod)
);
router.patch(
  "/classes/:scheduleId/payments/:paymentId",
  asyncHandler(paymentController.updatePaymentStatus)
);

module.exports = router;
