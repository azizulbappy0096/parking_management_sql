const { StatusCodes } = require("http-status-codes");
const db = require("../utils/db");

const loginUser = async (email, password) => {
  try {
    const [rows] = await db.execute(
      `SELECT user_id, name, email, role FROM users WHERE email = ? and password = ?`,
      [email, password]
    );

    if (rows.length === 0) {
      const err = new Error("Invalid email or password");
      err.code = StatusCodes.UNAUTHORIZED;
      err.status = "UNAUTHORIZED";
      throw err;
    }

    const user = rows[0];

    // if (user.password !== password) {
    //   const err = new Error("Invalid email or password");
    //   err.code = StatusCodes.UNAUTHORIZED;
    //   err.status = "UNAUTHORIZED";
    //   throw err;
    // }

    return user;
  } catch (err) {
    throw err;
  }
};

// administrator can register a new user
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
  loginUser,
};
