const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

router.use(authMiddleware);

router.post("/courses", asyncHandler(courseController.createCourse));
router.get("/courses", asyncHandler(courseController.listCourses));
router.delete("/courses/:scheduleId", asyncHandler(courseController.deleteCourse));

router.post("/course", asyncHandler(courseController.createCourse));
router.get("/showcourse", asyncHandler(courseController.listCourses));
router.delete(
  "/deletecourse/:scheduleId",
  asyncHandler(courseController.deleteCourse)
);

module.exports = router;
