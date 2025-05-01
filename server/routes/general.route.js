const express = require("express");
const router = express.Router();

const generalController = require("../controllers/general.controller");

router.post("/drivers", generalController.upsertDriver);
router.post("/vehicles", generalController.upsertVehicle);
router.get("/drivers", generalController.getAllDrivers);
router.get("/vehicles", generalController.getAllVehicles);
router.get("/drivers/:phone_num", generalController.getDriverByPhone);
router.get("/vehicles/:ve_numberplate", generalController.getVehicleByNumber);

router.delete("/drivers/:phone_num", generalController.deleteDriver);
router.delete("/vehicles/:ve_numberplate", generalController.deleteVehicle);

module.exports = router;
