const Ticket = require("../models/trainTicketModel");
const Train = require("../models/Train");
const SetsRecord = require("../models/setsRecord");

class QueueService {
  async handlePartialCancellation(ticket, fromStation, toStation) {
    try {
      // Calculate refund amount based on journey portion
      const refundAmount = this.calculatePartialRefund(
        ticket,
        fromStation,
        toStation
      );

      // Find waiting list tickets that could use this segment
      const waitingTickets = await this.findEligibleWaitingTickets(
        ticket.trainNo,
        fromStation,
        toStation,
        ticket.departuredate
      );

      // Try to accommodate waiting list passengers
      if (waitingTickets.length > 0) {
        const inflatedPrice = this.calculateInflatedPrice(
          ticket,
          fromStation,
          toStation
        );
        await this.processWaitingListUpgrade(waitingTickets[0], inflatedPrice);
      }

      return refundAmount;
    } catch (error) {
      throw new Error("Failed to process partial cancellation");
    }
  }

  async findEligibleWaitingTickets(trainNo, fromStation, toStation, date) {
    return await Ticket.find({
      trainNo,
      departuredate: date,
      waiting: true,
      departureStation: { $lte: fromStation },
      destinationStation: { $gte: toStation },
    }).sort({ _id: 1 }); // First come first serve
  }

  calculateInflatedPrice(originalTicket, fromStation, toStation) {
    // Implement last-minute booking price calculation
    const basePrice = originalTicket.amount;
    const inflationFactor = 1.3; // 30% increase for last-minute
    return basePrice * inflationFactor;
  }
}

module.exports = new QueueService();
