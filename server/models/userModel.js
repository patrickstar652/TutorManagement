const pool = require("../db");

const findByAccount = async (account) => {
  const result = await pool.query(
    "SELECT id, account, password FROM users WHERE account = $1",
    [account]
  );

  return result.rows[0] || null;
};

module.exports = {
  findByAccount,
};
