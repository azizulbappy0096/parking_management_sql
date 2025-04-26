const { StatusCodes } = require("http-status-codes");
const db = require("../utils/db");

const registerUser = async (userData) => {
  const { name, email, password, address, phone_num, role } = userData;
  try {
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, address, phone_num, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, address, phone_num, role]
    );

    return result;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      err = new Error("Email already exists");
      err.code = StatusCodes.CONFLICT;
      err.status = "CONFLICT";
    }
    throw err;
  }
};

const getAllManagers = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        user_id, 
        name, 
        email, 
        phone_num, 
        address
      FROM users
      WHERE role = 'manager'
      ORDER BY name ASC
    `);

    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  registerUser,
  getAllManagers,
};
