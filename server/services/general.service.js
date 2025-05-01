const { StatusCodes } = require("http-status-codes");
const db = require("../utils/db");

const upsertDriver = async ({
  driver_name,
  phone_num,
  driver_address = "",
}) => {
  try {
    const [rows] = await db.execute(
      `SELECT driver_id FROM drivers WHERE phone_num = ?`,
      [phone_num]
    );

    if (rows.length > 0) {
      // Update existing driver
      const driver_id = rows[0].driver_id;
      await db.execute(
        `UPDATE drivers SET driver_name = ?, driver_address = ? WHERE phone_num = ?`,
        [driver_name, driver_address, phone_num]
      );
      return { driver_id, updated: true };
    } else {
      // Insert new driver
      const [result] = await db.execute(
        `INSERT INTO drivers (driver_name, phone_num, driver_address)
           VALUES (?, ?, ?)`,
        [driver_name, phone_num, driver_address]
      );
      return { driver_id: result.insertId, created: true };
    }
  } catch (err) {
    throw err;
  }
};

const upsertVehicle = async ({ ve_numberplate, ve_type, driver_id }) => {
  try {
    const [rows] = await db.execute(
      `SELECT ve_numberplate FROM vehicles WHERE ve_numberplate = ?`,
      [ve_numberplate]
    );

    if (rows.length > 0) {
      // Update existing vehicle
      await db.execute(
        `UPDATE vehicles SET ve_type = ?, driver_id = ? WHERE ve_numberplate = ?`,
        [ve_type, driver_id, ve_numberplate]
      );
      return { ve_numberplate, updated: true };
    } else {
      // Insert new vehicle
      await db.execute(
        `INSERT INTO vehicles (ve_numberplate, ve_type, driver_id)
           VALUES (?, ?, ?)`,
        [ve_numberplate, ve_type, driver_id]
      );
      return { ve_numberplate, created: true };
    }
  } catch (err) {
    throw err;
  }
};

const getAllDrivers = async () => {
  try {
    const [rows] = await db.execute(`SELECT * FROM drivers`);
    return rows;
  } catch (err) {
    throw err;
  }
};

const getAllVehicles = async () => {
  try {
    const [rows] = await db.execute(`SELECT * FROM vehicles`);
    return rows;
  } catch (err) {
    throw err;
  }
};

const getDriverByPhone = async (phone_num) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM drivers WHERE phone_num = ?`,
      [phone_num]
    );
    return rows[0] || null;
  } catch (err) {
    throw err;
  }
};
const getVehicleByNumber = async (ve_numberplate) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
         v.ve_numberplate,
         v.ve_type,
         d.driver_id,
         d.driver_name,
         d.phone_num,
         d.driver_address
       FROM vehicles v
       LEFT JOIN drivers d ON v.driver_id = d.driver_id
       WHERE v.ve_numberplate = ?`,
      [ve_numberplate]
    );

    return rows[0] || null;
  } catch (err) {
    throw err;
  }
};

const deleteDriver = async (phone_num) => {
  try {
    const [result] = await db.execute(
      `DELETE FROM drivers WHERE phone_num = ?`,
      [phone_num]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteVehicle = async (numberplate) => {
  try {
    const [result] = await db.execute(
      `DELETE FROM vehicles WHERE ve_numberplate = ?`,
      [numberplate]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllDrivers,
  getAllVehicles,

  upsertDriver,
  upsertVehicle,

  getDriverByPhone,
  getVehicleByNumber,

  deleteDriver,
  deleteVehicle,
};
