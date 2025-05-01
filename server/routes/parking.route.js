const express = require("express");
const router = express.Router();

const parkingController = require("../controllers/parking.controller");

// get
router.get("/spaces", parkingController.getAllParkingSpaces);
router.get("/spots", parkingController.getAllParkingSpots);

router.get("/spaces/:id", parkingController.getParkingSpaceById);
router.get("/spots/:id", parkingController.getParkingSpotById);

router.get(
  "/spaces/:space_id/spots",
  parkingController.getParkingSpotsBySpaceId
);

// create
router.post("/spaces/create", parkingController.createParkingSpace);
router.post("/spots/create", parkingController.createParkingSpot);

// Update
router.put("/spaces/:id", parkingController.updateParkingSpace);
router.put("/spots/:id", parkingController.updateParkingSpot);

// Delete
router.delete("/spaces/:id", parkingController.deleteParkingSpace);
router.delete("/spots/:id", parkingController.deleteParkingSpot);

module.exports = router;
