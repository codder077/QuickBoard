const Booking = require("../models/Booking");
const bookingService = require("../services/bookingService");
const notificationService = require("../services/notificationService");

class BookingController {
  // Create booking
  async createBooking(req, res) {
    try {
      const bookingResult = await bookingService.bookTicket(req.user, req.body);

      res.status(201).json({ success: true, data: bookingResult });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get all bookings
  async getAllBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate("train")
        .populate("fromStation")
        .populate("toStation");

      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single booking
  async getBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("train")
        .populate("fromStation")
        .populate("toStation");

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      }

      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ success: false, error: "Not authorized" });
      }

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Cancel booking
  async cancelBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      }

      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ success: false, error: "Not authorized" });
      }

      booking.status = "CANCELLED";
      await booking.save();

      // Process refund if applicable
      await bookingService.processRefund(booking);

      // Send cancellation notification
      await notificationService.sendCancellationNotification(booking);

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Transfer booking
  async transferBooking(req, res) {
    try {
      const { id } = req.params;
      const { newUserId } = req.body;

      const booking = await Booking.findById(id);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      }

      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ success: false, error: "Not authorized" });
      }

      booking.user = newUserId;
      await booking.save();

      // Send transfer notifications
      await notificationService.sendTransferNotifications(booking, newUserId);

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new BookingController();
