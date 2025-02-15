const trainSchema = require("../models/train");
const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");
const TicketQueue = require("../models/TicketQueue");
const notificationService = require("../services/notificationService");
const Train = require("../models/train");

class BookingService {
  async checkSeatAvailability(trainId, coachType) {
    // Find the train and get coach details
    const train = await Train.findById(trainId);
    if (!train) {
      throw new Error("Train not found");
    }

    const coach = train.coaches.find(c => c.type === coachType);
    if (!coach) {
      throw new Error(`Coach type ${coachType} not found`);
    }

    // Get count of confirmed tickets for this train and coach
    const bookedTickets = await Ticket.countDocuments({
      train: trainId,
      coach: coachType,
      status: "CONFIRMED"
    });

    // Calculate available seats
    const availableSeats = coach.totalSeats - bookedTickets;
    return availableSeats;
  }

  async bookTicket(user, bookingData) {

    const { trainId, coach, passengers } = bookingData;
    console.log(user, "wawwewew");
    // Check seat availability
    const availableSeats = await this.checkSeatAvailability(trainId, coach);
    console.log("hii343qi");

    if (availableSeats <= 0) {
      // Add to waiting queue
      const queueEntry = await this.addToWaitingQueue(
        trainId,
        coach,
        user,
        passengers
      );
      throw new Error(
        `No seats available. Added to waiting list at position ${queueEntry.position}`
      );
    }

    // Continue with normal booking process
    try {
      const { fromStation, toStation, travelStartDate, travelEndDate } =
        bookingData;

      // Check train availability
      const train = await trainSchema.findById(trainId);
      if (!train) {
        throw new Error("Train not found");
      }

      // Calculate total fare for all passengers
      let totalFare = 0;
      const ticketPromises = passengers.map(async (passenger) => {
        const { name, age, gender } = passenger;

        // Calculate fare for this passenger
        const fare = this.calculateFare(train, coach, 1);
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
          coach: coach,
          seatNumber: await this.assignSeat(train, coach),
          fare,
          status: "CONFIRMED",
        });

        return ticket.save();
      });

      // Wait for all tickets to be created
      const savedTickets = await Promise.all(ticketPromises);

      // Create new booking
      const booking = new Booking({
        user: user,
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

  async addToWaitingQueue(trainId, coach, user, passengerDetails) {
    let queue = await TicketQueue.findOne({
      train: trainId,
      coach: coach,
      queueType: "WAITING",
    });

    if (!queue) {
      queue = new TicketQueue({
        train: trainId,
        coach: coach,
        queueType: "WAITING",
        requests: [],
      });
    }

    queue.requests.push({
      user: user._id,
      passengerDetails,
      status: "PENDING",
    });

    await queue.save();
    return { position: queue.requests.length };
  }

  async processTicketCancellation(ticket) {
    // Mark ticket as cancelled
    ticket.status = "CANCELLED";
    await ticket.save();

    // Check waiting queue
    const queue = await TicketQueue.findOne({
      train: ticket.train,
      coach: ticket.coach,
      queueType: "WAITING",
      "requests.status": "PENDING",
    }).populate("requests.user");

    if (queue && queue.requests.length > 0) {
      // Get first pending request
      const nextRequest = queue.requests.find((r) => r.status === "PENDING");
      if (nextRequest) {
        // Create new ticket for waiting user
        const newTicket = await this.createTicketFromQueue(ticket, nextRequest);

        // Update queue request status
        nextRequest.status = "FULFILLED";
        await queue.save();

        // Notify user about ticket confirmation
        await notificationService.sendWaitingListConfirmation(newTicket);
      }
    }

    return await this.processRefund(ticket);
  }

  async processTransferRequest(
    ticket,
    newUserId,
    newPassengerDetails,
    transferFare
  ) {
    console.log(ticket, newUserId, newPassengerDetails, transferFare, "wawwewew");
    const train = await Train.findById(ticket.train).populate("route.station");
    const hasStarted = await this.hasTrainStarted(train);
    const additionalFare = hasStarted ? ticket.fare * 0.2 : 0; // 20% extra if train started

    // Check for available seats
    const availableSeats = await this.checkSeatAvailability(
      train._id,
      ticket.coach
    );

    if (availableSeats > 0) {
      // Process immediate transfer if seats available
      const transferResult = await this.executeTransfer(
        ticket,
        newUserId,
        newPassengerDetails,
        transferFare || ticket.fare
      );
      return {
        success: true,
        transferComplete: true,
        data: transferResult,
        additionalFare,
      };
    } else {
      // Add to transfer queue if no seats available
      const queueResult = await this.addToTransferQueue(
        ticket,
        newUserId,
        newPassengerDetails,
        transferFare || ticket.fare
      );
      return {
        success: true,
        transferComplete: false,
        queuePosition: queueResult.position,
        additionalFare,
      };
    }
  }

  async executeTransfer(ticket, newUserId, newPassengerDetails, transferFare) {
    // Create new booking for transferred ticket
    const newBooking = new Booking({
      user: newUserId,
      tickets: [],
      totalFare: transferFare,
      paymentStatus: "PENDING",
    });
    await newBooking.save();

    // Create new ticket
    const newTicket = new Ticket({
      train: ticket.train,
      fromStation: ticket.fromStation,
      toStation: ticket.toStation,
      travelStartDate: ticket.travelStartDate,
      travelEndDate: ticket.travelEndDate,
      passenger: {
        ...ticket.passenger,
        ...newPassengerDetails,
      },
      coach: ticket.coach,
      seatNumber: ticket.seatNumber,
      fare: transferFare,
      status: "CONFIRMED",
      booking: newBooking._id,
      transferHistory: {
        // fromUser: ticket.booking.user,
        toUser: newUserId,
        transferredAt: new Date(),
      },
    });
    await newTicket.save();

    // Update new booking
    newBooking.tickets.push(newTicket._id);
    await newBooking.save();

    // Mark original ticket as transferred
    ticket.status = "CANCELLED";
    await ticket.save();

    return { newTicket, newBooking };
  }

  async addToTransferQueue(
    ticket,
    newUserId,
    newPassengerDetails,
    transferFare
  ) {
    let queue = await TicketQueue.findOne({
      train: ticket.train,
      coach: ticket.coach,
      queueType: "TRANSFER",
    });

    if (!queue) {
      queue = new TicketQueue({
        train: ticket.train,
        coach: ticket.coach,
        queueType: "TRANSFER",
        requests: [],
      });
    }

    // Add transfer request to queue
    queue.requests.push({
      user: newUserId,
      requestedAt: new Date(),
      passengerDetails: newPassengerDetails,
      fromStation: ticket.fromStation,
      toStation: ticket.toStation,
      status: "PENDING",
    });

    await queue.save();
    return { position: queue.requests.length };
  }

  async processTicketSale(ticket) {
    // Check transfer queue first
    const transferQueue = await TicketQueue.findOne({
      train: ticket.train,
      coach: ticket.coach,
      queueType: "TRANSFER",
      "requests.status": "PENDING",
    }).populate("requests.user");

    if (transferQueue && transferQueue.requests.length > 0) {
      const nextRequest = transferQueue.requests.find(
        (r) => r.status === "PENDING"
      );
      if (nextRequest) {
        // Process transfer for first person in queue
        const transferResult = await this.executeTransfer(
          ticket,
          nextRequest.user._id,
          nextRequest.passengerDetails,
          ticket.fare * 0.2 // 20% additional fare
        );

        // Update queue request status
        nextRequest.status = "FULFILLED";
        await transferQueue.save();

        // Notify users about transfer
        await notificationService.sendTransferConfirmation({
          originalTicket: ticket,
          newTicket: transferResult.newTicket,
          fromUser: ticket.booking.user,
          toUser: nextRequest.user._id,
        });

        return transferResult;
      }
    }

    // If no transfer requests, check waiting list
    return await this.processWaitingList(ticket);
  }

  async processWaitingList(ticket) {
    const waitingQueue = await TicketQueue.findOne({
      train: ticket.train,
      coach: ticket.coach,
      queueType: "WAITING",
      "requests.status": "PENDING",
    }).populate("requests.user");

    if (waitingQueue && waitingQueue.requests.length > 0) {
      const nextRequest = waitingQueue.requests.find(
        (r) => r.status === "PENDING"
      );
      if (nextRequest) {
        const newTicket = await this.createTicketFromQueue(ticket, nextRequest);
        nextRequest.status = "FULFILLED";
        await waitingQueue.save();

        await notificationService.sendWaitingListConfirmation(newTicket);
        return { newTicket };
      }
    }

    return null;
  }

  async hasTrainStarted(train) {
    const currentDate = new Date();
    const firstStation = train.route[0];
    const departureTime = new Date(firstStation.departureTime);
    return currentDate > departureTime;
  }
}

module.exports = new BookingService();
