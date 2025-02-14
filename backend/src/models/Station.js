const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  nearbyStations: [
    {
      station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
      },
      distance: Number, // in kilometers
      travelTime: Number, // in minutes
    },
  ],
  crowdLevel: {
    type: Number,
    default: 0, // 0-100 scale
    min: 0,
    max: 100,
  },
  stationMaster: {
    name: String,
    contact: String,
    email: String,
  },
});

// Index for geospatial queries
stationSchema.index({ location: "2dsphere" });

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
