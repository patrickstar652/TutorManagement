const express = require("express");
const router = express.Router();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

const loggerMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token 未提供" });
  }

  next();
};

router.post("/payment", async (req, res) => {
  const { name, status, paytime } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO payments (user_id, schedule_id, name, status, paytime) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [req.user.id, scheduleId, name, status, paytime]
    );
    res.status(200).json({ message: "付款成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "付款失敗" });
  }
});
router.use(loggerMiddleware);

module.exports = router;