const Train = require("../models/Train");
const Station = require("../models/Station");

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
}

module.exports = new TrainController();
