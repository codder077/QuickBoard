class CrowdPredictionService {
  async predictCrowdLevel(stationId, date) {
    const station = await Station.findById(stationId);
    const bookings = await Ticket.find({
      $or: [{ departureStation: stationId }, { destinationStation: stationId }],
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

    return {
      level: Math.min(100, Math.max(0, predictedLevel)),
      confidence: this.calculateConfidence(bookings.length, historicalFactor),
    };
  }

  calculateBaseCrowdLevel(bookings) {
    // Base calculation on number of bookings
    const averageBookingsPerDay = 100; // This could be configured based on station capacity
    const crowdLevel = (bookings.length / averageBookingsPerDay) * 100;
    
    // Ensure crowd level is between 0-100
    return Math.min(100, Math.max(0, crowdLevel));
  }

  async analyzeHistoricalPatterns(station, date) {
    const dayOfWeek = new Date(date).getDay();
    const hour = new Date(date).getHours();

    // Get historical crowd levels for same day and time
    const historicalData = await Station.aggregate([
      {
        $match: {
          _id: station._id,
          'crowdLevel.predictions.date': {
            $lt: new Date(date)
          }
        }
      },
      {
        $unwind: '$crowdLevel.predictions'
      },
      {
        $match: {
          'crowdLevel.predictions.date': {
            $expr: {
              $and: [
                { $eq: [{ $dayOfWeek: '$crowdLevel.predictions.date' }, dayOfWeek] },
                { $eq: [{ $hour: '$crowdLevel.predictions.date' }, hour] }
              ]
            }
          }
        }
      }
    ]);

    if (historicalData.length === 0) {
      return 50; // Default value if no historical data
    }

    // Calculate average historical crowd level
    const avgLevel = historicalData.reduce((sum, record) => 
      sum + record.crowdLevel.predictions.level, 0) / historicalData.length;
    
    return avgLevel;
  }

  async checkSpecialEvents(date) {
    // List of major holidays/events (could be moved to a database)
    const specialDates = {
      '12-25': 90, // Christmas
      '12-31': 85, // New Year's Eve
      '01-01': 80, // New Year's Day
      '07-04': 75, // Independence Day
    };

    const monthDay = new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit'
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
    const bookingConfidence = Math.min(bookingsCount / 100, 1) * 0.6;
    const historicalConfidence = (historicalFactor / 100) * 0.4;
    
    const totalConfidence = bookingConfidence + historicalConfidence;
    
    // Return confidence as percentage between 0-100
    return Math.min(100, Math.max(0, totalConfidence * 100));
  }
}

module.exports = new CrowdPredictionService();
