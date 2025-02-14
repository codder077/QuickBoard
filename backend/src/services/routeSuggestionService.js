const Station = require("../models/Station");

class RouteSuggestionService {
  async suggestAlternativeRoutes(fromStation, toStation) {
    // Find direct routes
    const directRoutes = await this.findDirectRoutes(fromStation, toStation);

    // Find routes with one interchange
    const interchangeRoutes = await this.findInterchangeRoutes(
      fromStation,
      toStation
    );

    // Check crowd levels and calculate scores
    const suggestions = [...directRoutes, ...interchangeRoutes].map(
      (route) => ({
        ...route,
        crowdScore: this.calculateCrowdScore(route),
        timeScore: this.calculateTimeScore(route),
        totalScore: this.calculateTotalScore(route),
      })
    );

    return suggestions.sort((a, b) => b.totalScore - a.totalScore);
  }

  async findNearbyAlternatives(station, maxDistance = 30) {
    return Station.find({
      location: {
        $near: {
          $geometry: station.location,
          $maxDistance: maxDistance * 1000, // Convert to meters
        },
      },
      crowdLevel: { $lt: station.crowdLevel },
    }).limit(5);
  }
}

module.exports = new RouteSuggestionService();
