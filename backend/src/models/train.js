const mongoose = require("mongoose");

const trainSchema = mongoose.Schema({
    trainNo: {
        type: Number,
        required: true,
    },
    trainName: {
        type: String,
        required: true
    },
    route: [{
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station',
            required: true
        },
        arrivalTime: {
            type: String,
            required: true
        },
        departureTime: {
            type: String,
            required: true
        },
        platform: {
            type: Number,
            required: true
        },
        distance: {
            type: Number,
            required: true
        },
        dayOfJourney: {
            type: Number,
            required: true
        }
    }],
    currentStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    delay: {
        type: Number,
        default: 0 // Delay in minutes
    },
    lastLocationUpdate: {
        type: Date,
        default: Date.now
    },
    frequency: {
        type: [String],
        required: true // Array of days when train runs ["Monday", "Tuesday" etc]
    },
    coaches: [{
        type: {
            type: String,
            required: true // AC1, AC2, AC3, Sleeper etc
        },
        totalSeats: {
            type: Number,
            required: true
        },
        fare: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Suspended'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Train', trainSchema);
