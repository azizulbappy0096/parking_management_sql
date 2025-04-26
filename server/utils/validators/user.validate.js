// modules
const { checkSchema } = require("express-validator");
const validatorHelper = require("./helper");

// validators
module.exports = {
  register: validatorHelper(
    checkSchema({
      firstName: {
        in: ["body"],
        isEmpty: {
          negated: true,
          errorMessage: "First name is required",
        },
        isLength: {
          errorMessage: "First name should be at least 2 chars long",
          options: { min: 2 },
        },
      },
      lastName: {
        in: ["body"],
        isEmpty: {
          negated: true,
          errorMessage: "Last name is required",
        },
        isLength: {
          errorMessage: "Last name should be at least 2 chars long",
          options: { min: 2 },
        },
      },
      email: {
        in: ["body"],
        isEmail: {
          errorMessage: "Invalid email address",
        },
      },
      password: {
        in: ["body"],
        isEmpty: {
          negated: true,
          errorMessage: "Password is required",
        },
        isLength: {
          errorMessage: "Password should be at least 6 chars long",
          options: { min: 6 },
        },
      },
    })
  ),
};
