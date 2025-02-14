const mongoose = require("mongoose");
const crypto = require("crypto");

const bookingSchema = new mongoose.Schema({
  // ... existing fields ...
  transferToken: {
    token: String,
    expiresAt: Date,
    isUsed: { type: Boolean, default: false },
  },
  transferHistory: [
    {
      fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      transferredAt: Date,
      price: Number,
    },
  ],
});

bookingSchema.methods.generateTransferToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.transferToken = {
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    isUsed: false,
  };
  return token;
};

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
