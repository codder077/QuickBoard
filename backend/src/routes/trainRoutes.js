const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const trainController = require("../controllers/trainController");

router.get("/", trainController.getAllTrains);
router.get("/:id", trainController.getTrain);
router.post("/", protect, trainController.createTrain);
router.put("/:id", protect, trainController.updateTrain);
router.delete("/:id", protect, trainController.deleteTrain);
router.put("/:id/location", protect, trainController.updateTrainLocation);
router.get("/:id/schedule", trainController.getTrainSchedule);
router.get("/search", trainController.findTrainsBetweenStations);

module.exports = router;
