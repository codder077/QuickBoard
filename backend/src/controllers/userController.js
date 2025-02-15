const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

class UserController {
  // Register user
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }
      
      console.log('waww');
      user = await User.create({
        name,
        email,
        password,
        phone
      });

      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get current user
  async getMe(req, res) {
    try {
      console.log(req.user, "wawwewew");
      const user = await User.findById(req.user.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update user details
  async updateDetails(req, res) {
    try {
      const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
      };

      const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Update password
  async updatePassword(req, res) {
    try {
      const user = await User.findById(req.user.id).select("+password");

      // Check current password
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      user.password = req.body.newPassword;
      await user.save();

      const token = generateToken(user._id);

      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new UserController();
