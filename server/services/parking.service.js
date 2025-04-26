const { StatusCodes } = require("http-status-codes");
const db = require("../utils/db");

const getAllParkingSpaces = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        ps.space_id,
        IFNULL(ps.space_address, '') AS space_address,
        IFNULL(ps.space_type, '') AS space_type,
        ps.mngr_id,
        IFNULL(u.name, '') AS manager_name,
        CAST(COUNT(pst.spot_id) AS UNSIGNED) AS total_spots,
        CAST(COALESCE(SUM(CASE WHEN pst.status = 'available' THEN 1 ELSE 0 END), 0) AS UNSIGNED) AS available_spots,
        ps.hourly_rate
      FROM parking_spaces ps
      LEFT JOIN users u ON ps.mngr_id = u.user_id
      LEFT JOIN parking_spots pst ON ps.space_id = pst.space_id
      LEFT JOIN Rate r ON ps.space_id = r.space_id
      GROUP BY ps.space_id
      ORDER BY ps.space_id ASC
    `);

    return rows;
  } catch (err) {
    throw err;
  }
};

const createParkingSpace = async (parkingData) => {
  const { space_type, mngr_id, space_address, hourly_rate } = parkingData;
  try {
    const [result] = await db.execute(
      `INSERT INTO parking_spaces (space_type, mngr_id, hourly_rate, space_address)
             VALUES (?, ?, ?, ?)`,
      [space_type, mngr_id, hourly_rate, space_address]
    );

    return result;
  } catch (err) {
    throw err;
  }
};

const updateParkingSpace = async (id, data) => {
  const { space_type, mngr_id, hourly_rate, space_address } = data;
  try {
    const [result] = await db.execute(
      `UPDATE parking_spaces SET space_type = ?, mngr_id = ?, hourly_rate = ?, space_address = ? WHERE space_id = ?`,
      [space_type, mngr_id, hourly_rate, space_address, id]
    );

    return result;
  } catch (err) {
    throw err;
  }
};

const deleteParkingSpace = async (id) => {
  try {
    const [result] = await db.execute(
      `DELETE FROM parking_spaces WHERE space_id = ?`,
      [id]
    );
    return result;
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      err = new Error("Cannot delete: Parking space has linked parking spots.");
      err.code = StatusCodes.CONFLICT;
      err.status = "CONFLICT";
    }
    throw err;
  }
};

const getAllParkingSpots = async () => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        pst.spot_id,
        IFNULL(pst.spot_name, '') AS spot_name,
        pst.space_id,
        IFNULL(ps.space_type, '') AS space_type,
        IFNULL(pst.status, 'available') AS status
      FROM parking_spots pst
      LEFT JOIN parking_spaces ps ON pst.space_id = ps.space_id
      ORDER BY pst.spot_id ASC
    `);

    return rows;
  } catch (err) {
    throw err;
  }
};

const createParkingSpot = async (spotData) => {
  const { spot_name, space_id, status } = spotData;
  try {
    const [result] = await db.execute(
      `INSERT INTO parking_spots (spot_name, space_id, status)
                 VALUES (?, ?, ?)`,
      [spot_name, space_id, status]
    );

    return result;
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      err = new Error("Space ID does not exist");
      err.code = StatusCodes.NOT_FOUND;
      err.status = "NOT_FOUND";
    }
    throw err;
  }
};

const updateParkingSpot = async (id, data) => {
  const { spot_name, space_id, spot_status } = data;
  try {
    const [result] = await db.execute(
      `UPDATE parking_spots SET spot_name = ?, space_id = ?, status = ? WHERE spot_id = ?`,
      [spot_name, space_id, spot_status, id]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteParkingSpot = async (id) => {
  try {
    const [result] = await db.execute(
      `DELETE FROM parking_spots WHERE spot_id = ?`,
      [id]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,

  getAllParkingSpots,
  createParkingSpot,
  updateParkingSpot,
  deleteParkingSpot,
};
