const jwt = require("jsonwebtoken");

const config = require("../config");
const userModel = require("../models/userModel");
const HttpError = require("../utils/httpError");
const { success } = require("../utils/response");
const { loginRequest } = require("../validators/requestValidators");

const healthCheck = (req, res) => {
  return success(res, {
    message: "Tutor Management API is running",
    time: new Date().toLocaleString(),
  });
};

const login = async (req, res) => {
  const { account, password } = loginRequest(req.body);
  const user = await userModel.findByAccount(account);

  if (!user || account !== user.account || password !== user.password) {
    throw new HttpError(401, "Invalid credentials", null, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    { id: user.id, account: user.account },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return success(
    res,
    {
      token,
      userId: user.id,
    },
    { message: "Login successful" }
  );
};

module.exports = {
  healthCheck,
  login,
};
