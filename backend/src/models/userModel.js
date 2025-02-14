const mongoose = require("mongoose");
const TrainTicket = require('./train');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true }, // Changed from fullName to match controller
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        phone: {
            type: Number,
            required: true,
            unique: true
        },
    }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Add password matching method used in controller
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;