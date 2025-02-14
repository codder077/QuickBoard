const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketQueueSchema = new Schema(
  {
    train: {
      type: Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    queueType: {
      type: String,
      enum: ["WAITING", "TRANSFER"],
      required: true,
    },
    queueArray: [
      {
        requestType: {
          type: String,
          enum: ["BUY", "SELL"],
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        ticket: {
          type: Schema.Types.ObjectId,
          ref: "Ticket",
        },
        passengerDetails: [{
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
        ],
        fromStation: {
          type: Schema.Types.ObjectId,
          ref: "Station",
        },
        toStation: {
          type: Schema.Types.ObjectId,
          ref: "Station",
        },
        originalFare: {
          type: Number,
        },
        createdAt: {
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

// Queue methods
ticketQueueSchema.methods.enqueue = function (request) {
  this.queueArray.push(request);
  return this.save();
};

ticketQueueSchema.methods.dequeue = function () {
  if (this.queueArray.length === 0) return null;
  const request = this.queueArray.shift();
  return this.save().then(() => request);
};

ticketQueueSchema.methods.peek = function () {
  if (this.queueArray.length === 0) return null;
  return this.queueArray[0];
};

ticketQueueSchema.methods.isEmpty = function () {
  return this.queueArray.length === 0;
};

module.exports = mongoose.model("TicketQueue", ticketQueueSchema);
