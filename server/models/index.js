const UserModel = `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone_num VARCHAR(20),
    role ENUM('manager', 'owner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

const ParkingSpaceModel = `CREATE TABLE IF NOT EXISTS parking_spaces (
    space_id INT AUTO_INCREMENT PRIMARY KEY,
    space_address VARCHAR(255),
    space_type VARCHAR(50),
    mngr_id INT,
    hourly_rate DECIMAL(10,2),
    FOREIGN KEY (mngr_id) REFERENCES users(user_id) ON DELETE SET NULL
  );`;

const ParkingSpotModel = `CREATE TABLE IF NOT EXISTS parking_spots (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,
    spot_name VARCHAR(50),
    space_id INT,
    status ENUM('occupied', 'available', 'out_of_service') DEFAULT 'available',
    FOREIGN KEY (space_id) REFERENCES parking_spaces(space_id) ON DELETE CASCADE
  );`;

const RateModel = `CREATE TABLE IF NOT EXISTS Rate (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  hourly_rate DECIMAL(10,2),
  space_id INT,
  FOREIGN KEY (space_id) REFERENCES parking_spaces(space_id) ON DELETE CASCADE
);`;

const VehicleModel = `CREATE TABLE IF NOT EXISTS vehicles (
  ve_numberplate VARCHAR(20) PRIMARY KEY,
  ve_type VARCHAR(50),
  driver_id INT,
  FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
);`;

const DriverModel = `CREATE TABLE IF NOT EXISTS drivers (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  driver_name VARCHAR(100),
  phone_num VARCHAR(15),
  driver_address VARCHAR(255)
);`;

module.exports = {
  UserModel,
  ParkingSpaceModel,
  ParkingSpotModel,
  RateModel,
  VehicleModel,
  DriverModel,
};
