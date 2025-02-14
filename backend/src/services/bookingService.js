const Train = require("../models/train");
const Booking = require("../models/Booking");

class BookingService {
  async bookTicket(user, bookingData) {
    try {
      const {
        trainId,
        fromStation,
        toStation,
        travelDate,
        passengers,
        coachType,
      } = bookingData;

      // Check seat availability
      const train = await Train.findById(trainId);
      if (!train) {
        throw new Error("Train not found");
      }

      // Calculate fare
      const fare = this.calculateFare(train, coachType, passengers.length);

      // Create new booking
      const booking = new Booking({
        user: user.id,
        train: trainId,
        fromStation,
        toStation,
        travelDate,
        passengers,
        coachType,
        fare,
        seatNumbers: await this.assignSeats(train, coachType),
      });

      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Booking failed: ${error.message}`);
    }
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

  calculateFare(train, coachType, passengerCount) {
    // Find the coach details from train
    const coach = train.coaches.find(c => c.type === coachType);
    if (!coach) {
      throw new Error(`Coach type ${coachType} not found`);
    }

    // Calculate base fare per passenger
    const baseFare = coach.fare;

    // Calculate total fare for all passengers
    const totalFare = baseFare * passengerCount;

    return totalFare;
  }

  async assignSeats(train, coachType) {
    // Find the coach details
    const coach = train.coaches.find(c => c.type === coachType);
    if (!coach) {
      throw new Error(`Coach type ${coachType} not found`);
    }

    // Get all existing bookings for this train and coach type
    const existingBookings = await Booking.find({
      train: train._id,
      coachType: coachType,
      status: "CONFIRMED"
    });

    // Get all occupied seat numbers
    const occupiedSeats = existingBookings.reduce((seats, booking) => {
      return [...seats, ...booking.seatNumbers];
    }, []);

    // Find first available seat
    let seatNumber = 1;
    while (occupiedSeats.includes(`${coachType}-${seatNumber}`)) {
      seatNumber++;
      if (seatNumber > coach.totalSeats) {
        throw new Error("No seats available in this coach");
      }
    }

    return [`${coachType}-${seatNumber}`];
  }

  calculateRefundAmount(booking) {
    const currentTime = new Date();
    const travelTime = new Date(booking.travelDate);
    const hoursToTravel = (travelTime - currentTime) / (1000 * 60 * 60);

    // Refund policy:
    // > 48 hours: 100% refund
    // 24-48 hours: 75% refund
    // 12-24 hours: 50% refund
    // < 12 hours: no refund
    
    if (hoursToTravel >= 48) {
      return booking.fare;
    } else if (hoursToTravel >= 24) {
      return booking.fare * 0.75;
    } else if (hoursToTravel >= 12) {
      return booking.fare * 0.50;
    } else {
      return 0;
    }
  }
}

module.exports = new BookingService();
