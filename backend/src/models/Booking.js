const mongoose = require("mongoose");
const crypto = require("crypto");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    fromStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    toStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    passengers: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          required: true,
          enum: ["Male", "Female", "Other"],
        },
      },
    ],
    coachType: {
      type: String,
      required: true,
      enum: ["AC1", "AC2", "AC3", "Sleeper"],
    },
    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["CONFIRMED", "WAITING", "CANCELLED"],
      default: "CONFIRMED",
    },
    fare: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "REFUNDED"],
      default: "PENDING",
    },
    transferToken: {
      token: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    transferHistory: [
      {
        fromUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        toUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        transferredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add method to generate transfer token
bookingSchema.methods.generateTransferToken = async function () {
  const train = await mongoose.model("Train").findById(this.train);
  if (!train) {
    throw new Error("Train not found");
  }

  // Calculate token expiration time (booking time + journey end time)
  const journeyEndTime = new Date(this.travelDate);
  journeyEndTime.setHours(journeyEndTime.getHours() + train.journeyDuration);

  this.transferToken = {
    token: crypto.randomBytes(20).toString("hex"),
    expiresAt: journeyEndTime,
  };

  await this.save();
  return this.transferToken;
};

// Add method to record transfer history
bookingSchema.methods.recordTransfer = async function (fromUserId, toUserId) {
  this.transferHistory.push({
    fromUser: fromUserId,
    toUser: toUserId,
  });

  await this.save();
};

module.exports = mongoose.model("Booking", bookingSchema);
