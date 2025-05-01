const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/response");

const generalServices = require("../services/general.service");

const upsertDriver = async (req, res, next) => {
  try {
    const { driver_name, phone_num, driver_address } = req.body;
    const driverData = {
      driver_name,
      phone_num,
      driver_address: driver_address || "",
    };

    const result = await generalServices.upsertDriver(driverData);

    successResponse(
      res,
      "Driver upserted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const upsertVehicle = async (req, res, next) => {
  try {
    const { ve_numberplate, ve_type, driver_id } = req.body;
    const vehicleData = {
      ve_numberplate,
      ve_type,
      driver_id: parseInt(driver_id, 10),
    };

    const result = await generalServices.upsertVehicle(vehicleData);

    successResponse(
      res,
      "Vehicle upserted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await generalServices.getAllDrivers();

    successResponse(
      res,
      "Drivers fetched successfully",
      { drivers },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await generalServices.getAllVehicles();

    successResponse(
      res,
      "Vehicles fetched successfully",
      { vehicles },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const getDriverByPhone = async (req, res, next) => {
  try {
    const { phone_num } = req.params;
    const driver = await generalServices.getDriverByPhone(phone_num);

    if (!driver) {
      return successResponse(
        res,
        "Driver not found",
        {},
        StatusCodes.NOT_FOUND
      );
    }

    successResponse(
      res,
      "Driver fetched successfully",
      { driver },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const getVehicleByNumber = async (req, res, next) => {
  try {
    const { ve_numberplate } = req.params;
    const vehicle = await generalServices.getVehicleByNumber(ve_numberplate);

    if (!vehicle) {
      return successResponse(
        res,
        "Vehicle not found",
        {},
        StatusCodes.NOT_FOUND
      );
    }

    successResponse(
      res,
      "Vehicle fetched successfully",
      { vehicle },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const { phone_num } = req.params;
    const result = await generalServices.deleteDriver(phone_num);

    if (!result) {
      return successResponse(
        res,
        "Driver not found",
        {},
        StatusCodes.NOT_FOUND
      );
    }

    successResponse(
      res,
      "Driver deleted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { ve_numberplate } = req.params;
    const result = await generalServices.deleteVehicle(ve_numberplate);

    if (!result) {
      return successResponse(
        res,
        "Vehicle not found",
        {},
        StatusCodes.NOT_FOUND
      );
    }

    successResponse(
      res,
      "Vehicle deleted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upsertDriver,
  upsertVehicle,
  getAllDrivers,
  getAllVehicles,
  getDriverByPhone,
  getVehicleByNumber,
  deleteDriver,
  deleteVehicle,
};
