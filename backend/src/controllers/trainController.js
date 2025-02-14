const Train = require("../models/train");
const Station = require("../models/Station");
const routeSuggestionService = require("../services/routeSuggestionService");

class TrainController {
  // Get all trains
  async getAllTrains(req, res) {
    try {
      const trains = await Train.find()
        .populate("route.station")
        .populate("currentStation");
      res.status(200).json({ success: true, data: trains });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single train
  async getTrain(req, res) {
    try {
      const train = await Train.findById(req.params.id)
        .populate("route.station")
        .populate("currentStation");

      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      res.status(200).json({ success: true, data: train });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create train
  async createTrain(req, res) {
    try {
      const train = await Train.create(req.body);
      res.status(201).json({ success: true, data: train });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Update train
  async updateTrain(req, res) {
    try {
      const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      res.status(200).json({ success: true, data: train });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Delete train
  async deleteTrain(req, res) {
    try {
      const train = await Train.findByIdAndDelete(req.params.id);

      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update train location
  async updateTrainLocation(req, res) {
    try {
      const { id } = req.params;
      const { currentStation, delay } = req.body;

      const station = await Station.findById(currentStation);
      if (!station) {
        return res
          .status(404)
          .json({ success: false, error: "Station not found" });
      }

      const train = await Train.findByIdAndUpdate(
        id,
        {
          currentStation,
          delay: delay || 0,
          lastLocationUpdate: new Date(),
        },
        { new: true }
      );

      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      res.status(200).json({ success: true, data: train });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get train schedule
  async getTrainSchedule(req, res) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      const train = await Train.findById(id).populate("route.station");

      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      const schedule = train.route.map((stop) => ({
        station: stop.station,
        arrivalTime: stop.arrivalTime,
        departureTime: stop.departureTime,
        platform: stop.platform,
      }));

      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Find trains between stations
  async findTrainsBetweenStations(req, res) {
    try {
      const { startStation, endStation } = req.query;

      const start = await Station.findById(startStation);
      const end = await Station.findById(endStation);

      if (!start || !end) {
        return res.status(404).json({
          success: false,
          error: "Start or end station not found",
        });
      }

      // Find direct trains
      const directTrains = await Train.find({
        "route.station": { $all: [startStation, endStation] },
        status: "Active",
      }).populate("route.station");

      // Filter trains where end station comes after start station in route
      const validDirectTrains = directTrains.filter((train) => {
        const startIndex = train.route.findIndex(
          (r) => r.station.id === startStation
        );
        const endIndex = train.route.findIndex(
          (r) => r.station.id === endStation
        );
        return startIndex < endIndex;
      });

      // Find nearby stations
      const [nearbyStartStations, nearbyEndStations] = await Promise.all([
        routeSuggestionService.findNearbyAlternatives(start, 10),
        routeSuggestionService.findNearbyAlternatives(end, 30),
      ]);

      // Modified nearby stations query
      const nearbyStartStationIds = nearbyStartStations.map(
        (s) => s.station._id || s.station
      );
      const nearbyEndStationIds = nearbyEndStations.map(
        (s) => s.station._id || s.station
      );

      const nearbyStationTrains = await Train.find({
        status: "Active",
        $and: [
          { "route.station": { $in: nearbyStartStationIds } },
          { "route.station": { $in: nearbyEndStationIds } },
        ],
      }).populate("route.station");
      console.log("nearbyStationTrains", nearbyStationTrains);
      res.status(200).json({
        success: true,
        data: {
          directTrains: validDirectTrains,
          alternativeTrains: nearbyStationTrains
        },
      });
    } catch (error) {
      console.error("Error in findTrainsBetweenStations:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Add bulk create trains method
  async createManyTrains(req, res) {
    try {
      const trains = await Train.insertMany(req.body.trains);
      res.status(201).json({ success: true, data: trains });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new TrainController();
