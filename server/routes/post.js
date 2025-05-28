const express = require("express");
const router = express.Router();

require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

router.post("/course", async (req, res) => {
  const { courseName, day, startTime, endTime, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO course ("courseName", day, "startTime", "endTime", note) VALUES ($1, $2, $3, $4, $5)',
      [courseName, day, startTime, endTime, note]
    );
    res.status(200).json({ success: true, message: "新增成功" });
  } catch (error) {
    console.log(err);
  }
});

router.get("/showcourse", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT "courseName", day, "startTime", "endTime", note FROM course ORDER BY day, "startTime"'
    );
    res.status(200).json(result.rows);// 陣列包物件
    //[
    // {
    //   "courseName"
    // },
    // {
    //   "courseName"
    // }
    //]
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
