const Station = require("../models/Station");
const routeSuggestionService = require("../services/routeSuggestionService");

class StationController {
  // Get all stations
  async getAllStations(req, res) {
    try {
      const stations = await Station.find().populate("nearbyStations.station");
      res.status(200).json({ success: true, data: stations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single station
  async getStation(req, res) {
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
  async createStation(req, res) {
    try {
      const station = await Station.create(req.body);
      res.status(201).json({ success: true, data: station });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Update station
  async updateStation(req, res) {
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
  async deleteStation(req, res) {
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
  async getNearbyStations(req, res) {
    try {
      const { id } = req.params;
      const { radius = 50 } = req.query; // radius in kilometers

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
  async updateCrowdLevel(req, res) {
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
}

module.exports = new StationController();
