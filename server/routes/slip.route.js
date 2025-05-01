const express = require("express");
const router = express.Router();

const slipController = require("../controllers/slip.controller");

router.get("/", slipController.getAllSlips);
router.post("/create", slipController.createParkingSlip);
router.get("/checkout/:slip_id", slipController.checkoutSlip);

module.exports = router;
