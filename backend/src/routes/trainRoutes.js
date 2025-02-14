const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const trainController = require("../controllers/trainController");

router.get("/", trainController.getAllTrains);
router.get("/findTrain/:id", trainController.getTrain);
router.post("/", protect, trainController.createTrain);
router.put("/updateTrain/:id", protect, trainController.updateTrain);
router.delete("/deleteTrain/:id", protect, trainController.deleteTrain);
router.put("/updateTrainLocation/:id/location", protect, trainController.updateTrainLocation);
router.get("/getTrainSchedule/:id/schedule", trainController.getTrainSchedule);
router.get("/search", trainController.findTrainsBetweenStations);
router.post("/bulk", protect, trainController.createManyTrains);

module.exports = router;
