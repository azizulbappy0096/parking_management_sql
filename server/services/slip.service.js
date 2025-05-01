const { StatusCodes } = require("http-status-codes");
const db = require("../utils/db");

const getAllSlips = async () => {
  try {
    const [rows] = await db.execute(`
        SELECT 
          ps.slip_id,
          ps.type,
          ps.duration,
          ps.issue_date,
          ps.ve_numberplate,
          ps.total_amount,
          v.ve_type,
          d.driver_name,
          d.phone_num AS driver_phone,
          d.driver_address,
          ps.spot_id,
          pst.spot_name,
          pspace.space_id,
          pspace.space_address,
          pspace.space_type
        FROM parking_slip ps
        LEFT JOIN vehicles v ON ps.ve_numberplate = v.ve_numberplate
        LEFT JOIN drivers d ON v.driver_id = d.driver_id
        LEFT JOIN parking_spots pst ON ps.spot_id = pst.spot_id
        LEFT JOIN parking_spaces pspace ON pst.space_id = pspace.space_id
        ORDER BY ps.slip_id DESC
      `);

    return rows;
  } catch (err) {
    console.log("Error fetching parking slips:", err);
    throw err;
  }
};

const createParkingSlip = async ({
  type,
  duration,
  veh_nameplate,
  spot_id,
}) => {
  try {
    const issueDate = new Date();

    // Step 1: Get the hourly rate for the space via spot_id
    const [[{ hourly_rate } = {}]] = await db.execute(
      `
        SELECT ps.hourly_rate
        FROM parking_spots p
        JOIN parking_spaces ps ON p.space_id = ps.space_id
        WHERE p.spot_id = ?
        `,
      [spot_id]
    );

    if (!hourly_rate) {
      throw new Error("Hourly rate not found for this spot.");
    }

    // Step 2: Calculate total amount
    const total_amount = duration * parseFloat(hourly_rate);

    const [result] = await db.execute(
      `INSERT INTO parking_slip (type, duration, issue_date, ve_numberplate, spot_id, total_amount)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [type, duration, issueDate, veh_nameplate, spot_id, total_amount]
    );

    await db.execute(
      `UPDATE parking_spots SET status = 'occupied' WHERE spot_id = ?`,
      [spot_id]
    );

    return { slip_id: result.insertId };
  } catch (err) {
    throw err;
  }
};

const checkoutSlip = async (slip_id) => {
  try {
    // Step 1: Get the spot_id from the slip
    const [[{ spot_id } = {}]] = await db.execute(
      `SELECT spot_id FROM parking_slip WHERE slip_id = ?`,
      [slip_id]
    );

    if (!spot_id) {
      throw new Error("Invalid slip_id or slip not found.");
    }

    // Step 2: Update the spot status to 'available'
    let [result] = await db.execute(
      `UPDATE parking_spots SET status = 'available' WHERE spot_id = ?`,
      [spot_id]
    );

    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllSlips,
  createParkingSlip,
  checkoutSlip,
};
