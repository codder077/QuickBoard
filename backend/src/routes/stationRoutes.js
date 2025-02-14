const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const stationController = require("../controllers/stationController");

router.get("/", stationController.getAllStations);
router.get("/:id", stationController.getStation);
router.post("/", protect, stationController.createStation);
router.post("/many", protect, stationController.createManyStations);
router.put("/:id", protect, stationController.updateStation);
router.delete("/:id", protect, stationController.deleteStation);
router.get("/:id/nearby", stationController.getNearbyStations);
router.put("/:id/crowd", protect, stationController.updateCrowdLevel);
router.get("/:stationId/crowd/:date", stationController.getCrowdLevel);
router.get("/:stationId/alternatives", stationController.suggestAlternativeStations);

module.exports = router;