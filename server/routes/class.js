const express = require("express");
const router = express.Router();

const classController = require("../controllers/classController");
const asyncHandler = require("../middleware/asyncHandler");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/classes", asyncHandler(classController.listClasses));
router.patch(
  "/classes/:scheduleId/seats/:seatId",
  asyncHandler(classController.updateSeat)
);
router.get("/classes/:scheduleId/seats", asyncHandler(classController.getSeats));

router.get("/class", asyncHandler(classController.listClasses));
router.patch("/seat", asyncHandler(classController.updateSeat));
router.get("/seat/:scheduleId", asyncHandler(classController.getSeats));

module.exports = router;
