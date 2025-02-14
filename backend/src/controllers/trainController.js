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
      // console.log("waw");
      const { startStation, endStation } = req.query;
      //   console.log(startStation, endStation);
      // Validate input stations
      const [start, end] = await Promise.all([
        Station.findById(startStation),
        Station.findById(endStation),
      ]);
      //   console.log(start, end);
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
      //   console.log(directTrains);
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

      // Find nearby stations within 10km radius
      const [nearbyStartStations, nearbyEndStations] = await Promise.all([
        Station.find({
          location: {
            $near: {
              $geometry: start.location,
              $maxDistance: 10000, // 10km in meters
            },
          },
          _id: { $ne: start._id },
        }),
        Station.find({
          location: {
            $near: {
              $geometry: end.location,
              $maxDistance: 10000, // 10km in meters
            },
          },
          _id: { $ne: end._id },
        }),
      ]);

      // Find trains from nearby stations
      console.log("waw1");
      const nearbyStationTrains = await Train.find({
        "route.station": {
          $all: [
            {
              $in: (
                await routeSuggestionService.findNearbyAlternatives(
                  start,
                  10
                )
              )?.map((s) => s._id),
            },
            {
              $in: (
                await routeSuggestionService.findNearbyAlternatives(
                  end,
                  10
                )
              )?.map((s) => s._id),
            },
          ],
        },
        status: "Active",
      }).populate("route.station");
      console.log("waw2", nearbyStationTrains);
      // Filter nearby trains where end station comes after start station
      const validNearbyTrains = nearbyStationTrains.filter((train) => {
        const startStationIndex = train.route.findIndex((r) =>
          nearbyStartStations.some((s) => s._id.equals(r.station._id))
        );
        const endStationIndex = train.route.findIndex((r) =>
          nearbyEndStations.some((s) => s._id.equals(r.station._id))
        );
        return startStationIndex < endStationIndex;
      });

      res.status(200).json({
        success: true,
        data: {
          directTrains: validDirectTrains.map((train) => ({
            trainNo: train.trainNo,
            trainName: train.trainName,
            departureTime: train.route.find(
              (r) => r.station.id === startStation
            ).departureTime,
            arrivalTime: train.route.find((r) => r.station.id === endStation)
              .arrivalTime,
            route: train.route,
          })),
          alternativeTrains: validNearbyTrains.map((train) => {
            const startStationInfo = train.route.find((r) =>
              nearbyStartStations.some((s) => s._id.equals(r.station._id))
            );
            const endStationInfo = train.route.find((r) =>
              nearbyEndStations.some((s) => s._id.equals(r.station._id))
            );
            return {
              trainNo: train.trainNo,
              trainName: train.trainName,
              departureStation: startStationInfo.station,
              arrivalStation: endStationInfo.station,
              departureTime: startStationInfo.departureTime,
              arrivalTime: endStationInfo.arrivalTime,
              route: train.route,
            };
          }),
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
