const express = require("express");
const router = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const pool = require("../db");

const loggerMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token 未提供" });
  }

  next();
};

// server/routes/payment.js

router.patch("/payment", async (req, res) => {
  const { scheduleId, student, amount, status } = req.body;

  try {
    const query = `
      UPDATE payments 
      SET amount = $1, status = $2, created_at = $3 
      WHERE schedule_id = $4 AND student_name = $5 
      RETURNING *
    `;
    const values = [amount, status, new Date(), scheduleId, student];

    const result = await pool.query(query, values);

    // 如果沒更新到資料 (可能名字傳錯，或找不到人)
    if (result.rows.length === 0) {
       return res.status(404).json({ message: "找不到該學生的資料，更新失敗" });
    }

    res.status(200).json({ message: "更新成功", data: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新失敗" });
  }
});

router.get("/payment/:scheduleId", async (req, res) => {
  const scheduleId = req.params.scheduleId
  try {
    const result = await pool.query(
      "SELECT * FROM payments WHERE schedule_id = $1",
      [scheduleId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "取得失敗" });
  }
})

module.exports = router;
