const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/response");

const parkingServices = require("../services/parking.service");

const getAllParkingSpaces = async (req, res, next) => {
  try {
    const spaces = await parkingServices.getAllParkingSpaces();

    successResponse(
      res,
      "Parking spaces fetched successfully",
      { spaces },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const createParkingSpace = async (req, res, next) => {
  try {
    const { space_type, mngr_id, hourly_rate, space_address } = req.body;
    const parkingData = {
      space_type: space_type?.toLowerCase(),
      mngr_id: parseInt(mngr_id, 10),
      hourly_rate: parseFloat(hourly_rate),
      space_address,
    };
    const result = await parkingServices.createParkingSpace(parkingData);

    successResponse(
      res,
      "Parking space created successfully",
      { result },
      StatusCodes.CREATED
    );
  } catch (err) {
    next(err);
  }
};

const updateParkingSpace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { space_type, mngr_id, hourly_rate, space_address } = req.body;

    const updateData = {
      space_type: space_type?.toLowerCase(),
      mngr_id: parseInt(mngr_id, 10),
      hourly_rate: parseFloat(hourly_rate),
      space_address,
    };

    const result = await parkingServices.updateParkingSpace(id, updateData);

    successResponse(
      res,
      "Parking space updated successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const deleteParkingSpace = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await parkingServices.deleteParkingSpace(id);

    successResponse(
      res,
      "Parking space deleted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const getAllParkingSpots = async (req, res, next) => {
  try {
    const spots = await parkingServices.getAllParkingSpots();

    successResponse(
      res,
      "Parking spots fetched successfully",
      { spots },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const createParkingSpot = async (req, res, next) => {
  try {
    const { spot_name, space_id, status } = req.body;
    const spotData = {
      spot_name: spot_name?.toUpperCase(),
      space_id: parseInt(space_id, 10),
      status: status?.toLowerCase(),
    };
    const result = await parkingServices.createParkingSpot(spotData);

    successResponse(
      res,
      "Parking spot created successfully",
      { result },
      StatusCodes.CREATED
    );
  } catch (err) {
    next(err);
  }
};

const updateParkingSpot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { spot_name, space_id, spot_status } = req.body;

    const updateData = {
      spot_name: spot_name?.toUpperCase(),
      space_id: parseInt(space_id, 10),
      spot_status: spot_status?.toLowerCase(),
    };

    const result = await parkingServices.updateParkingSpot(id, updateData);

    successResponse(
      res,
      "Parking spot updated successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

const deleteParkingSpot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await parkingServices.deleteParkingSpot(id);

    successResponse(
      res,
      "Parking spot deleted successfully",
      { result },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
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
