const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");

router.post("/", protect, bookingController.createBooking);
router.get("/", protect, bookingController.getAllBookings);
router.get("/:id", protect, bookingController.getBooking);
router.put("/:id/cancel", protect, bookingController.cancelBooking);
router.put("/:id/transfer", protect, bookingController.transferBooking);

module.exports = router;
