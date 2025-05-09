const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/managers", userController.getAllManagers);

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

module.exports = router;
