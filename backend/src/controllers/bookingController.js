const Booking = require("../models/Booking");
const bookingService = require("../services/bookingService");
const notificationService = require("../services/notificationService");
const Ticket = require("../models/Ticket");
const TicketQueue = require("../models/TicketQueue");
const Train = require("../models/train");
const Razorpay=require("razorpay");
const crypto=require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
        coach,
        amount
      } = req.body;
      console.log(req.user, "wawwewew");
      // Create booking through service
      console.log(trainId, fromStation, toStation, travelStartDate, travelEndDate, passengers, "wawwrwrw");
      const bookingResult = await bookingService.bookTicket(req.user.id, {
        trainId,
        fromStation,
        toStation,
        travelStartDate,
        travelEndDate,
        passengers,
        coach,
        amount
      });
      console.log("hiii");
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };
    razorpay.orders.create(options, async (error, payment) => {
        if (error) {
            console.error("Error creating order:", error);
            return res.status(500).send({ message: "Something went wrong" });
        }
        // console.log("Payment:", payment);
        console.log(bookingResult)
        // await notificationService.sendBookingConfirmation(bookingResult);
        res.status(201).json({
            message: 'Order created successfully! Complete payment to confirm.',
            payment,
            orderId:payment.id,
        });
    });
      // Send booking confirmation email
     

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
      const { newUserId, newPassengerDetails } = req.body;

      const booking = await Booking.findById(id).populate("tickets");
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

      const transferResult = await bookingService.processTransferRequest(
        booking.tickets[0],
        newUserId,
        newPassengerDetails
      );

      res.status(200).json({
        success: true,
        data: {
          ...transferResult,
          message: transferResult.transferComplete
            ? "Transfer processed successfully"
            : `Added to transfer queue at position ${transferResult.queuePosition}`,
        },
      });
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

  // Add new endpoint to sell ticket
  // ... existing code ...

  async sellTicket(req, res) {
    try {
      const { pnr } = req.params;

      const ticket = await Ticket.findOne({ pnr }).populate([
        "train",
        "fromStation",
        "toStation",
      ]);

      if (!ticket) {
        return res
          .status(404)
          .json({ success: false, error: "Ticket not found" });
      }

      // if (ticket.booking.user.toString() !== req.user.id) {
      //   return res
      //     .status(403)
      //     .json({ success: false, error: "Not authorized" });
      // }

      // Determine queue type based on journey start
      const currentDate = new Date();
      const journeyStartDate = new Date(ticket.travelStartDate);
      const queueType = currentDate > journeyStartDate ? "TRANSFER" : "WAITING";

      // Find or create queue for this train and coach
      let ticketQueue = await TicketQueue.findOne({
        train: ticket.train._id,
        coach: ticket.coach,
        queueType: queueType,
      });

      if (!ticketQueue) {
        ticketQueue = new TicketQueue({
          train: ticket.train._id,
          coach: ticket.coach,
          queueType: queueType,
          queueArray: [],
        });
        await ticketQueue.save();
      }

      // Check if there are any buy requests in the queue
      const buyerIndex = ticketQueue.queueArray.findIndex(
        (request) => request.requestType === "BUY"
      );

      if (buyerIndex !== -1) {
        // Get the buyer request
        const buyerRequest = ticketQueue.queueArray[buyerIndex];
        console.log(buyerRequest, "wawwewe235253453w");
        // Remove the buyer from queue
        ticketQueue.queueArray.splice(buyerIndex, 1);
        await ticketQueue.save();

        // Calculate fare based on queue type
        let transferFare = ticket.fare;
        if (queueType === "TRANSFER") {
          // Add 20% premium for transfer queue
          transferFare = ticket.fare * 1.2;
        }

        // Process transfer to the buyer
        const transferResult = await bookingService.processTransferRequest(
          ticket,
          buyerRequest.user.toString(),
          buyerRequest.passengerDetails,
          transferFare
        );

        return res.status(200).json({
          success: true,
          data: {
            message: `Ticket transferred to waiting buyer (${queueType} queue)`,
            transferResult,
            fare: transferFare,
            queueType: queueType,
          },
        });
      } else {
        // If no buyers in queue, add this as a sell request
        const sellingRequest = {
          requestType: "SELL",
          user: req.user.id,
          ticket: ticket._id,
          passengerDetails: ticket.passenger,
          fromStation: ticket.fromStation,
          toStation: ticket.toStation,
          originalFare: ticket.fare,
        };

        ticketQueue.queueArray.push(sellingRequest);
        await ticketQueue.save();

        return res.status(200).json({
          success: true,
          data: {
            message: `No buyers found. Ticket added to ${queueType} queue for selling`,
            queuePosition: ticketQueue.queueArray.length,
            queueType: queueType,
          },
        });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async buyTicket(req, res) {
    try {
      const { trainId, coach, passengerDetails } = req.body;
      console.log(trainId, coach, passengerDetails, "wawwewew");
      // Determine queue type based on journey start
      const train = await Train.findById(trainId);
      if (!train) {
        return res
          .status(404)
          .json({ success: false, error: "Train not found" });
      }

      const currentDate = new Date();
      const journeyStartDate = new Date(train.departureTime);
      const queueType = currentDate > journeyStartDate ? "TRANSFER" : "WAITING";

      // Find queue for this train and coach
      let ticketQueue = await TicketQueue.findOne({
        train: trainId,
        coach,
        queueType: queueType,
      });

      if (!ticketQueue) {
        ticketQueue = new TicketQueue({
          train: trainId,
          coach,
          queueType: queueType,
          queueArray: [],
        });
        await ticketQueue.save();
      }

      // Check if there are any sell requests in the queue
      console.log(ticketQueue.queueArray);
      const sellerIndex = ticketQueue.queueArray.findIndex(
        (request) => request.requestType === "SELL"
      );
      console.log(sellerIndex, "wawwewe235253453w");
      if (sellerIndex !== -1) {
        // Get the seller request
        const sellerRequest = ticketQueue.queueArray[sellerIndex];
        // Remove the seller from queue
        ticketQueue.queueArray.splice(sellerIndex, 1);
        await ticketQueue.save();

        // Calculate fare based on queue type
        let transferFare = sellerRequest.originalFare;
        if (queueType === "TRANSFER") {
          // Add 20% premium for transfer queue
          transferFare = sellerRequest.originalFare * 1.2;
        }

        // Process transfer from the seller
        const transferResult = await bookingService.processTransferRequest(
          sellerRequest.ticket,
          req.user.id,
          passengerDetails,
          transferFare
        );

        return res.status(200).json({
          success: true,
          data: {
            message: `Ticket purchased from waiting seller (${queueType} queue)`,
            transferResult,
            fare: transferFare,
            queueType: queueType,
          },
        });
      } else {
        // If no sellers in queue, add this as a buy request
        const buyingRequest = {
          requestType: "BUY",
          user: req.user.id,
          passengerDetails,
          requestedAt: new Date(),
        };

        ticketQueue.queueArray.push(buyingRequest);
        await ticketQueue.save();

        return res.status(200).json({
          success: true,
          data: {
            message: `No sellers found. Buy request added to ${queueType} queue`,
            queuePosition: ticketQueue.queueArray.length,
            queueType: queueType,
          },
        });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ... existing code ...
}

module.exports = new BookingController();
