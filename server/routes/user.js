const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/success", userController.healthCheck);
router.post("/login", asyncHandler(userController.login));

module.exports = router;
