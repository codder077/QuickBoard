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

  async findNearbyAlternatives(station, maxDistance = 30) { // Default 30km radius
    try {
      console.log("station", station);
      const nearbyStations = await Station.find({
        _id: { $ne: station._id }, // Exclude the current station
        location: {
          $near: {
            $geometry: station.location,
            $maxDistance: maxDistance * 1000, // Convert km to meters
          }
        }
      }).select('name code location crowdLevel.current nearbyStations');
      console.log("nearbyStations", nearbyStations);
      // Calculate distances and map results
      const mappedStations = nearbyStations.map(nearby => {
        // Calculate distance between points using MongoDB's $geoNear
        const distance = this.calculateDistance(
          station.location.coordinates,
          nearby.location.coordinates
        );

        return {
          station: nearby._id,
          name: nearby.name,
          code: nearby.code,
          location: nearby.location,
          crowdLevel: nearby.crowdLevel.current,
          distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
          travelTime: Math.round(distance * 2) // Rough estimate: 2 min per km
        };
      });
      console.log("mappedStations", mappedStations);
      return mappedStations;

    } catch (error) {
      console.error('Error finding nearby stations:', error);
      throw error;
    }
  }

  calculateDistance(coords1, coords2) {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;
    
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  toRad(degrees) {
    return degrees * (Math.PI/180);
  }
}

module.exports = new RouteSuggestionService();
