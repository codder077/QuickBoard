const mongoose = require("mongoose");
const Train = require("./train");
const Station = require("./Station");
const ticketSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      // required: true,
      unique: true,
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
    travelStartDate: {
      type: Date,
      required: true,
    },
    travelEndDate: {
      type: Date,
      required: true,
    },
    passenger: {
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
        enum: ["MALE", "FEMALE", "OTHER"],
        required: true,
      },
    },
    coach: {
      type: String,
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "WAITLISTED", "CANCELLED"],
      default: "CONFIRMED",
    },
    // booking: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Booking",
    //   required: true,
    // },
    fare: {
      type: Number,
      required: true,
    },
    transferHistory: 
      {
        // fromUser: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        // },
        toUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        transferredAt: {
          type: Date,
          default: Date.now,
        },
      },
  },
  {
    timestamps: true,
  }
);

// Generate PNR number
ticketSchema.pre("save", async function (next) {
  if (!this.pnr) {
    // Generate a 10-character PNR using numbers and capital letters
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let pnr = "";
    for (let i = 0; i < 10; i++) {
      pnr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.pnr = pnr;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
