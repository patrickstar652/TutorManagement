const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

router.use(authMiddleware);

router.patch(
  "/classes/:scheduleId/payments",
  asyncHandler(paymentController.updatePayment)
);
router.get(
  "/classes/:scheduleId/payments",
  asyncHandler(paymentController.listPayments)
);

router.patch("/payment", asyncHandler(paymentController.updatePayment));
router.get("/payment/:scheduleId", asyncHandler(paymentController.listPayments));

module.exports = router;
