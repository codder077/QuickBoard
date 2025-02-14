const trainSchema = require("../models/train");
const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");

class BookingService {
  async bookTicket(user, bookingData) {
    try {
      const {
        trainId,
        fromStation,
        toStation,
        travelStartDate,
        travelEndDate,
        passengers,
      } = bookingData;

      // Check train availability
      const train = await trainSchema.findById(trainId);
      if (!train) {
        throw new Error("Train not found");
      }

      // Calculate total fare for all passengers
      let totalFare = 0;
      const ticketPromises = passengers.map(async (passenger) => {
        const { name, age, gender, coachType } = passenger;

        // Calculate fare for this passenger
        const fare = this.calculateFare(train, coachType, 1);
        totalFare += fare;

        // Create ticket
        const ticket = new Ticket({
          train: trainId,
          fromStation,
          toStation,
          travelStartDate,
          travelEndDate,
          passenger: {
            name,
            age,
            gender,
          },
          coach: coachType,
          seatNumber: await this.assignSeat(train, coachType),
          fare,
          status: "CONFIRMED",
        });

        return ticket.save();
      });

      // Wait for all tickets to be created
      const savedTickets = await Promise.all(ticketPromises);

      // Create new booking
      const booking = new Booking({
        user: user.id,
        tickets: savedTickets.map((ticket) => ticket._id),
        totalFare,
        paymentStatus: "PENDING",
      });

      // Update tickets with booking reference
      const ticketUpdatePromises = savedTickets.map((ticket) => {
        ticket.booking = booking._id;
        return ticket.save();
      });

      await Promise.all([booking.save(), ...ticketUpdatePromises]);
      return booking;
    } catch (error) {
      throw new Error(`Booking failed: ${error.message}`);
    }
  }

  calculateFare(train, coachType, passengerCount) {
    // Find the coach details from train
    const coach = train.coaches.find((c) => c.type === coachType);
    if (!coach) {
      throw new Error(`Coach type ${coachType} not found`);
    }

    // Calculate base fare per passenger
    const baseFare = coach.fare;
    return baseFare * passengerCount;
  }

  async assignSeat(train, coachType) {
    // Find the coach details
    const coach = train.coaches.find((c) => c.type === coachType);
    if (!coach) {
      throw new Error(`Coach type ${coachType} not found`);
    }

    // Get all existing tickets for this train and coach type
    const existingTickets = await Ticket.find({
      train: train._id,
      coachType: coachType,
      status: "CONFIRMED",
    });

    // Get all occupied seat numbers
    const occupiedSeats = existingTickets.map((ticket) => ticket.seatNumber);

    // Find first available seat
    let seatNumber = 1;
    while (occupiedSeats.includes(`${coachType}-${seatNumber}`)) {
      seatNumber++;
      if (seatNumber > coach.totalSeats) {
        throw new Error("No seats available in this coach");
      }
    }

    return `${coachType}-${seatNumber}`;
  }

  async processRefund(booking) {
    try {
      // Only process refund for cancelled bookings
      if (booking.status !== "CANCELLED") {
        throw new Error("Refund can only be processed for cancelled bookings");
      }

      // Calculate refund amount based on cancellation time
      const refundAmount = this.calculateRefundAmount(booking);

      // Update booking payment status
      booking.paymentStatus = "REFUNDED";
      await booking.save();

      // Process refund logic here (payment gateway integration)
      return { success: true, refundAmount };
    } catch (error) {
      throw new Error(`Refund processing failed: ${error.message}`);
    }
  }

  calculateRefundAmount(booking) {
    const currentTime = new Date();
    const travelTime = new Date(booking.travelStartDate);
    const hoursToTravel = (travelTime - currentTime) / (1000 * 60 * 60);

    // Refund policy:
    // > 48 hours: 100% refund
    // 24-48 hours: 75% refund
    // 12-24 hours: 50% refund
    // < 12 hours: no refund

    if (hoursToTravel >= 48) {
      return booking.totalFare;
    } else if (hoursToTravel >= 24) {
      return booking.totalFare * 0.75;
    } else if (hoursToTravel >= 12) {
      return booking.totalFare * 0.5;
    } else {
      return 0;
    }
  }

  async processTicketRefund(ticket) {
    try {
      // Only process refund for cancelled tickets
      if (ticket.status !== "CANCELLED") {
        throw new Error("Refund can only be processed for cancelled tickets");
      }

      // Calculate refund amount based on cancellation time
      const refundAmount = this.calculateTicketRefundAmount(ticket);

      // Process refund logic here (payment gateway integration would go here)

      return { success: true, refundAmount };
    } catch (error) {
      throw new Error(`Refund processing failed: ${error.message}`);
    }
  }

  calculateTicketRefundAmount(ticket) {
    const currentTime = new Date();
    const travelTime = new Date(ticket.travelStartDate);
    const hoursToTravel = (travelTime - currentTime) / (1000 * 60 * 60);

    // Refund policy:
    // > 48 hours: 100% refund
    // 24-48 hours: 75% refund
    // 12-24 hours: 50% refund
    // < 12 hours: no refund
    if (hoursToTravel >= 48) {
      return ticket.fare;
    } else if (hoursToTravel >= 24) {
      return ticket.fare * 0.75;
    } else if (hoursToTravel >= 12) {
      return ticket.fare * 0.5;
    } else {
      return 0;
    }
  }
}

module.exports = new BookingService();
