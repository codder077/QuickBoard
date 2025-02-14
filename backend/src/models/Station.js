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
    current: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    historical: [
      {
        date: Date,
        level: Number,
        bookings: Number,
      },
    ],
    predictions: [
      {
        date: Date,
        level: Number,
        confidence: Number,
      },
    ],
  },
});

// Index for geospatial queries
stationSchema.index({ location: "2dsphere" });

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
