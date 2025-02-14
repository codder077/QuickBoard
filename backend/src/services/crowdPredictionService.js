const TrainTicket = require("../models/trainTicketModel");
const Station = require("../models/Station");
class CrowdPredictionService {
  async predictCrowdLevel(station, date) {
    const bookings = await TrainTicket.find({
      $or: [
        { departureStation: station._id },
        { destinationStation: station._id },
      ],
      departuredate: {
        $gte: new Date(date).setHours(0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59),
      },
    });

    // Calculate base crowd level from bookings
    const baseLevel = this.calculateBaseCrowdLevel(bookings);

    // Factor in historical patterns
    const historicalFactor = await this.analyzeHistoricalPatterns(
      station,
      date
    );

    // Consider special events or holidays
    const eventFactor = await this.checkSpecialEvents(date);

    // Combine factors with weights
    const predictedLevel =
      baseLevel * 0.5 + historicalFactor * 0.3 + eventFactor * 0.2;

    const finalLevel =
      predictedLevel > 100 ? 100 : predictedLevel < 0 ? 0 : predictedLevel;

    return {
      level: finalLevel,
      confidence: this.calculateConfidence(bookings.length, historicalFactor),
    };
  }

  calculateBaseCrowdLevel(bookings) {
    // Base calculation on number of bookings
    const averageBookingsPerDay = 100; // This could be configured based on station capacity
    const crowdLevel = (bookings.length / averageBookingsPerDay) * 100;

    // Ensure crowd level is between 0-100
    return crowdLevel > 100 ? 100 : crowdLevel < 0 ? 0 : crowdLevel;
  }

  async analyzeHistoricalPatterns(station, date) {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    const hour = targetDate.getHours();

    // Get historical crowd levels for same day and time
    const historicalData = await Station.aggregate([
      {
        $match: {
          _id: station._id,
          "crowdLevel.predictions.date": { $lt: targetDate },
        },
      },
      {
        $unwind: "$crowdLevel.predictions",
      },
      {
        $project: {
          prediction: "$crowdLevel.predictions",
          dayOfWeek: { $dayOfWeek: "$crowdLevel.predictions.date" },
          hour: { $hour: "$crowdLevel.predictions.date" },
        },
      },
      {
        $match: {
          dayOfWeek: dayOfWeek,
          hour: hour,
        },
      },
    ]);

    if (historicalData.length === 0) {
      return 50; // Default value if no historical data
    }

    // Calculate average historical crowd level
    const avgLevel =
      historicalData.reduce((sum, record) => sum + record.prediction.level, 0) /
      historicalData.length;

    return avgLevel;
  }

  async checkSpecialEvents(date) {
    // List of major holidays/events (could be moved to a database)
    const specialDates = {
      "12-25": 90, // Christmas
      "12-31": 85, // New Year's Eve
      "01-01": 80, // New Year's Day
      "07-04": 75, // Independence Day
    };

    const monthDay = new Date(date).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });

    // Check if date is a special event
    if (specialDates[monthDay]) {
      return specialDates[monthDay];
    }

    // Default crowd level for regular days
    return 50;
  }

  calculateConfidence(bookingsCount, historicalFactor) {
    // More bookings and stronger historical patterns increase confidence
    const bookingConfidence = bookingsCount > 100 ? 1 : bookingsCount / 100;
    const historicalConfidence = (historicalFactor / 100) * 0.4;

    const totalConfidence = bookingConfidence * 0.6 + historicalConfidence;

    // Return confidence as percentage between 0-100
    const finalConfidence = totalConfidence * 100;
    return finalConfidence > 100
      ? 100
      : finalConfidence < 0
      ? 0
      : finalConfidence;
  }
}

module.exports = new CrowdPredictionService();
