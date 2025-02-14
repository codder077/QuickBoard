const Booking = require("../models/Booking");
const bookingService = require("../services/bookingService");
const notificationService = require("../services/notificationService");
const Ticket = require("../models/Ticket");

class BookingController {
  // Create booking
  async createBooking(req, res) {
    try {
      const {
        trainId,
        fromStation,
        toStation,
        travelStartDate,
        travelEndDate,
        passengers,
      } = req.body;

      // Create booking through service
      const bookingResult = await bookingService.bookTicket(req.user, {
        trainId,
        fromStation,
        toStation,
        travelStartDate,
        travelEndDate,
        passengers,
      });

      // Send booking confirmation email
      await notificationService.sendBookingConfirmation(bookingResult);

      res.status(201).json({ success: true, data: bookingResult });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Get all bookings
  async getAllBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user.id }).populate({
        path: "tickets",
        populate: ["train", "fromStation", "toStation"],
      });

      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get single booking
  async getBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id).populate({
        path: "tickets",
        populate: ["train", "fromStation", "toStation"],
      });

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      }

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
      // console.log(booking, "WAW");
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
      console.log("waw");
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
      //   await notificationService.sendTransferNotifications(booking, newUserId);

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Cancel ticket by PNR
  async cancelTicket(req, res) {
    try {
      const { pnr } = req.params;

      // Find ticket by PNR
      const ticket = await Ticket.findOne({ pnr }).populate([
        {
          path: "booking",
          populate: ["user"],
        },
        {
          path: "train",
        },
        {
          path: "fromStation",
        },
        {
          path: "toStation",
        },
      ]);

      if (!ticket) {
        return res
          .status(404)
          .json({ success: false, error: "Ticket not found" });
      }

      // Check if the ticket's booking belongs to the user
      if (ticket.booking.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ success: false, error: "Not authorized" });
      }

      // Update ticket status
      ticket.status = "CANCELLED";
      await ticket.save();

      // Process refund for this ticket
      const refundResult = await bookingService.processTicketRefund(ticket);

      // Update booking's total fare
      const booking = await Booking.findById(ticket.booking._id);
      booking.totalFare -= refundResult.refundAmount;

      // If all tickets in the booking are cancelled, update booking payment status
      const allTickets = await Ticket.find({ booking: booking._id });
      const allCancelled = allTickets.every((t) => t.status === "CANCELLED");
      if (allCancelled) {
        booking.paymentStatus = "REFUNDED";
      }
      await booking.save();

      // Send cancellation notification with complete ticket details
      await notificationService.sendTicketCancellationNotification({
        ticket,
        user: ticket.booking.user,
        refundAmount: refundResult.refundAmount,
        booking: {
          id: booking._id,
          totalFare: booking.totalFare,
          paymentStatus: booking.paymentStatus,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          ticket,
          refundAmount: refundResult.refundAmount,
          booking: {
            id: booking._id,
            totalFare: booking.totalFare,
            paymentStatus: booking.paymentStatus,
          },
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // Transfer ticket
  async transferTicket(req, res) {
    try {
      const { pnr } = req.params;
      const { newUserId, newToStation, newTravelEndDate, newPassengerDetails } =
        req.body;

      // Find original ticket with all necessary populated fields
      const originalTicket = await Ticket.findOne({ pnr }).populate([
        {
          path: "booking",
          populate: ["user"],
        },
        "train",
        "fromStation",
        "toStation",
      ]);

      if (!originalTicket) {
        return res
          .status(404)
          .json({ success: false, error: "Ticket not found" });
      }

      // Update original ticket
      originalTicket.toStation = newToStation;
      originalTicket.travelEndDate = newTravelEndDate;
      originalTicket.transferHistory = {
        fromUser: req.user.id,
        toUser: newUserId,
        transferredAt: new Date(),
      };
      await originalTicket.save();

      // Create new booking for transferred portion
      const newBooking = new Booking({
        user: newUserId,
        tickets: [],
        totalFare: 0,
        paymentStatus: "PENDING",
      });
      await newBooking.save();

      // Create new ticket for the transferred portion
      const newTicket = new Ticket({
        train: originalTicket.train,
        fromStation: originalTicket.toStation, // Original ticket's destination is new ticket's source
        toStation: newToStation,
        travelStartDate: originalTicket.travelEndDate,
        travelEndDate: newTravelEndDate,
        passenger: {
          ...originalTicket.passenger,
          ...newPassengerDetails,
        },
        coach: originalTicket.coach,
        seatNumber: await bookingService.assignSeat(
          originalTicket.train,
          originalTicket.coach
        ),
        fare: await bookingService.calculateFare(
          originalTicket.train,
          originalTicket.coach,
          1
        ),
        status: "CONFIRMED",
        booking: newBooking._id,
        transferHistory: {
          fromUser: req.user.id,
          toUser: newUserId,
          transferredAt: new Date(),
        },
      });
      await newTicket.save();

      // Update new booking with ticket and fare
      newBooking.tickets.push(newTicket._id);
      newBooking.totalFare = newTicket.fare;
      await newBooking.save();

      // Send transfer notifications to both users
      await notificationService.sendTicketTransferNotification({
        originalTicket,
        newTicket,
        fromUser: req.user,
        toUser: newUserId,
        originalBooking: originalTicket.booking,
        newBooking,
      });

      res.status(200).json({
        success: true,
        data: {
          originalTicket,
          newTicket,
          newBooking,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new BookingController();
