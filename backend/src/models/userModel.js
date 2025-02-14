const mongoose = require("mongoose");
const TrainTicket = require('./train'); 

const userSchema = mongoose.Schema(
    {
        fullName: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        phone: {
            type: "Number",
            required: true,
            unique: true
        },

        trainTickets: [TrainTicket.schema] 

    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;