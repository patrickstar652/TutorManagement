const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const parseList = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

module.exports = {
  clientOrigins: CLIENT_ORIGIN === "*" ? "*" : parseList(CLIENT_ORIGIN),
  isProduction: NODE_ENV === "production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  jwtSecret: process.env.SECRET_KEY,
  nodeEnv: NODE_ENV,
  port: Number(process.env.PORT || 3000),
};
