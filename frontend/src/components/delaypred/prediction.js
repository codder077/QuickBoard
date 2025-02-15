import React, { useState } from "react";

const TrainComparisonForm = () => {
  const [trainId1, setTrainId1] = useState("");
  const [trainId2, setTrainId2] = useState("");
  const [arrivalPoint1, setArrivalPoint1] = useState("");
  const [arrivalPoint2, setArrivalPoint2] = useState("");
  const [destinationPoint1, setDestinationPoint1] = useState("");
  const [destinationPoint2, setDestinationPoint2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trainIds = [trainId1, trainId2];

    try {
      const response = await fetch("https://dashboard.render.com/web/srv-cnqbv3tjm4es73cn6t80/deploys/dep-cunee5popnds73d5lf6g", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainIds }), // Send only the list of train IDs
      });

      const data = await response.json();
      console.log("Response from ML API:", data);
      // Handle the response as needed (e.g., display results)
    } catch (error) {
      console.error("Error calling ML API:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Train Comparison</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Train ID 1:</label>
        <input
          type="text"
          value={trainId1}
          onChange={(e) => setTrainId1(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Arrival Point 1:</label>
        <input
          type="text"
          value={arrivalPoint1}
          onChange={(e) => setArrivalPoint1(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Destination Point 1:</label>
        <input
          type="text"
          value={destinationPoint1}
          onChange={(e) => setDestinationPoint1(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Train ID 2:</label>
        <input
          type="text"
          value={trainId2}
          onChange={(e) => setTrainId2(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Arrival Point 2:</label>
        <input
          type="text"
          value={arrivalPoint2}
          onChange={(e) => setArrivalPoint2(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Destination Point 2:</label>
        <input
          type="text"
          value={destinationPoint2}
          onChange={(e) => setDestinationPoint2(e.target.value)}
          className="w-full p-2 rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300">
        Compare Trains
      </button>
    </form>
  );
};

export default TrainComparisonForm;
