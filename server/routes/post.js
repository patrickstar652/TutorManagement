const express = require("express");
const router = express.Router();

require("dotenv").config();

const { Pool } = require("pg");
// 建立 PostgreSQL Pool
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

