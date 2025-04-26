const mysql = require("mysql2");
const config = require("../utils/config");
const models = require("../models");

// Step 1: Create initial connection without database
const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password, // make sure this is set in your config
});

// Step 2: Create the database if it doesn't exist
connection.query(
  `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\``,
  (err) => {
    if (err) throw err;
    console.log(`Database "${config.db.database}" ensured.`);

    // Optional: close that temporary connection
    connection.end();

    // Step 3: Now create the pool with the database specified
    const pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    pool.getConnection((err, conn) => {
      if (err) throw err;
      console.log("Connected to the database as ID " + conn.threadId);
      conn.release();
    });

    let db = pool.promise();

    (async () => {
      try {
        await db.query(models.UserModel);
        await db.query(models.DriverModel);
        await db.query(models.VehicleModel);
        await db.query(models.ParkingSpaceModel);
        await db.query(models.ParkingSpotModel);
        await db.query(models.RateModel);
        console.log("✅ All tables ensured.");
      } catch (err) {
        console.error("❌ Error ensuring tables:", err.message);
      }
    })();
  }
);

module.exports = mysql
  .createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();
