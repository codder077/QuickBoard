const Station = require("../models/Station");
const routeSuggestionService = require("../services/routeSuggestionService");
const crowdPredictionService = require("../services/crowdPredictionService");

// Use arrow functions to preserve 'this' context
class StationController {
  // Get all stations
  getAllStations = async (req, res) => {
    try {
      const stations = await Station.find().populate("nearbyStations.station");
      res.status(200).json({ success: true, data: stations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single station
  getStation = async (req, res) => {
    try {
      const station = await Station.findById(req.params.id).populate(
        "nearbyStations.station"
      );

      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      res.status(200).json({ success: true, data: station });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create station
  createStation = async (req, res) => {
    try {
      const station = await Station.create(req.body);
      res.status(201).json({ success: true, data: station });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Create multiple stations
  createManyStations = async (req, res) => {
    try {
      const stations = req.body;
      if (!Array.isArray(stations)) {
        return res.status(400).json({
          success: false,
          error: "Request body must be an array of stations"
        });
      }

      const createdStations = await Station.insertMany(stations);
      res.status(201).json({ success: true, data: createdStations });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Update station
  updateStation = async (req, res) => {
    try {
      const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      res.status(200).json({ success: true, data: station });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Delete station
  deleteStation = async (req, res) => {
    try {
      const station = await Station.findByIdAndDelete(req.params.id);

      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get nearby stations
  getNearbyStations = async (req, res) => {
    try {
      const { id } = req.params;
      const { radius = 10 } = req.query; // radius in kilometers

      const station = await Station.findById(id);
      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      const nearbyStations =
        await routeSuggestionService.findNearbyAlternatives(station, radius);
      res.status(200).json({ success: true, data: nearbyStations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update crowd level
  updateCrowdLevel = async (req, res) => {
    try {
      const { id } = req.params;
      const { crowdLevel } = req.body;

      if (crowdLevel < 0 || crowdLevel > 100) {
        return res.status(400).json({
          success: false,
          error: "Crowd level must be between 0 and 100",
        });
      }

      const station = await Station.findByIdAndUpdate(
        id,
        { crowdLevel },
        { new: true }
      );

      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      res.status(200).json({ success: true, data: station });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  getCrowdLevel = async (req, res) => {
    try {
      const { stationId, date } = req.params;

      // Get current crowd level
      const station = await Station.findById(stationId);
      if (!station) {
        return res.status(404).json({ success: false, error: "Station not found" });
      }

      // Get prediction for future date
      const prediction = await crowdPredictionService.predictCrowdLevel(
        station,
        date
      );
      // Update station predictions
      await Station.findByIdAndUpdate(stationId, {
        $push: {
          "crowdLevel.predictions": {
            date: new Date(date),
            level: prediction.level,
            confidence: prediction.confidence,
          },
        },
      });

      // Get alternative stations
      const alternativeStations = await this.suggestAlternativeStations(station, prediction.level);

      return res.status(200).json({
        currentLevel: station.crowdLevel.current,
        prediction: prediction,
        alternativeStations: alternativeStations,
      });
    } catch (error) {
      console.error("Error in getCrowdLevel:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  suggestAlternativeStations = async (station, crowdLevel) => {
    if (crowdLevel < 70) return []; // Only suggest alternatives for high crowd levels

    return Station.find({
      location: {
        $near: {
          $geometry: station.location,
          $maxDistance: 30000, // 30km radius
        },
      },
      "crowdLevel.current": { $lt: crowdLevel - 20 },
    });
  }
}

module.exports = new StationController();