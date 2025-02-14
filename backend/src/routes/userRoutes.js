const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/me", protect, userController.getMe);
router.put("/updatedetails", protect, userController.updateDetails);
router.put("/updatepassword", protect, userController.updatePassword);

module.exports = router;
