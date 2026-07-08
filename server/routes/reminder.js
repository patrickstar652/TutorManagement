const express = require("express");
const router = express.Router();

const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

router.use(authMiddleware);

router.post("/reminder", asyncHandler(reminderController.createReminder));
router.get("/reminder", asyncHandler(reminderController.listReminders));
router.delete("/reminder/:id", asyncHandler(reminderController.deleteReminder));

module.exports = router;
