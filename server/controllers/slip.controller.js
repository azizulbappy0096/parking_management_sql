const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/response");

const slipServices = require("../services/slip.service");

const getAllSlips = async (req, res, next) => {
  try {
    const slips = await slipServices.getAllSlips();

    return successResponse(res, "Slips fetched", { slips }, StatusCodes.OK);
  } catch (err) {
    next(err);
  }
};

const createParkingSlip = async (req, res, next) => {
  try {
    const { type, duration, veh_nameplate, spot_id } = req.body;

    const slip = await slipServices.createParkingSlip({
      type,
      duration,
      veh_nameplate,
      spot_id,
    });

    return successResponse(res, "Slip created", { slip }, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};

const checkoutSlip = async (req, res, next) => {
  try {
    const { slip_id } = req.params;

    const spot = await slipServices.checkoutSlip(slip_id);

    return successResponse(res, "Slip checked out", { spot }, StatusCodes.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSlips,
  createParkingSlip,
  checkoutSlip,
};
