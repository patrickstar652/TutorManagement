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

router.use(loggerMiddleware);

router.post("/course", async (req, res) => {
  const { courseName, day, startTime, endTime, note } = req.body;

  try {
    // 開始交易
    await pool.query("BEGIN");

    // 1. 插入課程並取得產生的 ID
    const courseResult = await pool.query(
      'INSERT INTO course ("courseName", day, "startTime", "endTime", note) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [courseName, day, startTime, endTime, note]
    );

    const courseId = courseResult.rows[0].id;

    // 2. 將 course_id 插入到 class 表
    await pool.query("INSERT INTO class (course_id) VALUES ($1)", [courseId]);

    // 提交交易
    await pool.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "新增成功",
      courseId: courseId,
    });
  } catch (error) {
    // 發生錯誤時回滾交易
    await pool.query("ROLLBACK");
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "新增失敗",
      error: error.message,
    });
  }
});

router.get("/showcourse",  async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT "courseName", day, "startTime", "endTime", note FROM course ORDER BY day, "startTime"'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

router.get("/class", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT course_id, "courseName" FROM class JOIN course ON class.course_id = course.id'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

router.patch("/seat", async (req, res) => {
  const { course_id, seat_id, name } = req.body;

  try {
    // 驗證必要欄位
    if (!course_id || !seat_id) {
      return res.status(400).json({
        success: false,
        message: "course_id 和 seat_id 是必要欄位",
      });
    }

    // 先取得現有的 students 陣列
    const currentResult = await pool.query(
      "SELECT students FROM class WHERE course_id = $1",
      [course_id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的課程",
      });
    }

    // 取得現有的 students 陣列，如果為 null 則建立空陣列
    let students = currentResult.rows[0].students || [];

    // 建立新的座位字串格式: "seat_id:name"
    const seatString = `${seat_id}:${name || ""}`;

    // 檢查是否已存在該座位
    const existingIndex = students.findIndex((student) =>
      student.startsWith(`${seat_id}:`)
    );

    if (existingIndex >= 0) {
      // 更新現有座位
      students[existingIndex] = seatString;
    } else {
      // 新增座位
      students.push(seatString);
    }

    // 更新資料庫，使用 PostgreSQL 陣列語法
    const result = await pool.query(
      "UPDATE class SET students = $1::text[] WHERE course_id = $2 RETURNING *",
      [students, course_id]
    );

    res.status(200).json({
      success: true,
      message: "座位資料更新成功",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("更新座位資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "更新失敗",
      error: error.message,
    });
  }
});

// 取得座位資料
router.get("/seat/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      "SELECT students FROM class WHERE course_id = $1",
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的課程",
      });
    }

    const students = result.rows[0].students || [];

    // 將字串陣列轉換為物件陣列
    const seatsData = students.map((student) => {
      const [seat_id, name] = student.split(":");
      return { seat_id, name };
    });

    res.status(200).json({
      success: true,
      data: seatsData,
    });
  } catch (error) {
    console.error("取得座位資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "取得資料失敗",
      error: error.message,
    });
  }
});

module.exports = router;
