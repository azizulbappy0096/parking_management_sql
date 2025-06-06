const { StatusCodes } = require("http-status-codes");
const { successResponse } = require("../utils/response");

const userServices = require("../services/user.service");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.loginUser(email, password);

    successResponse(res, "Login successful", { user }, StatusCodes.OK);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      address = "",
      phone_num = "",
      role,
    } = req.body;
    const userData = {
      name,
      email,
      password,
      address,
      phone_num,
      role,
    };
    const result = await userServices.registerUser(userData);

    successResponse(
      res,
      "User registered successfully",
      { result },
      StatusCodes.CREATED
    );
  } catch (err) {
    next(err);
  }
};

const getAllManagers = async (req, res, next) => {
  try {
    const managers = await userServices.getAllManagers();

    successResponse(
      res,
      "Managers fetched successfully",
      { managers },
      StatusCodes.OK
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getAllManagers,
};
