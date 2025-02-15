import React, { useState, useEffect } from "react";

const TrainComparisonForm = () => {
  const [trainId1, setTrainId1] = useState("");
  const [trainId2, setTrainId2] = useState("");
  const [arrivalPoint1, setArrivalPoint1] = useState("");
  const [arrivalPoint2, setArrivalPoint2] = useState("");
  const [destinationPoint1, setDestinationPoint1] = useState("");
  const [destinationPoint2, setDestinationPoint2] = useState("");
  const [trainsData, setTrainsData] = useState([]);
  const [response, setResponse] = useState(null); // State to store the API response

  useEffect(() => {
    const fetchTrainsData = async () => {
      try {
        const response = await fetch("/path/to/ml/trains.json"); // Update with the correct path to JSON
        const data = await response.json();
        setTrainsData(data); // Assuming data is an array of train objects
      } catch (error) {
        console.error("Error fetching train data:", error);
      }
    };

    fetchTrainsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      "D1": [trainId1, trainId2], // Structure the payload as required
    };

    try {
      const response = await fetch("https://quickboard-6.onrender.com/output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the structured payload
      });

      const data = await response.json();
      console.log("Response from ML API:", data);
      setResponse(data); // Store the response in state
    } catch (error) {
      console.error("Error calling ML API:", error);
      setResponse({ error: "Failed to fetch data" }); // Handle error response
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Train Comparison</h2>

      {/* Train ID 1 Input */}
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



      {/* Destination Point 1 Input */}


      {/* Train ID 2 Input */}
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

      {/* Arrival Point 2 Input */}


      {/* Destination Point 2 Input */}


      <button type="submit" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300">
        Compare Trains
      </button>

      {/* Display Response */}
      {response && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold text-white">Response:</h3>
          {response.error ? (
            <p className="text-red-400">{response.error}</p>
          ) : (
            <div>
              <p className="text-white">Probability Missing Train B: {response.probability_missing_train_B}</p>
              <p className="text-white">Train ID 1 Delay: {response.train_ID1_delay}</p>
              <p className="text-white">Train ID 2 Delay: {response.train_ID2_delay}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default TrainComparisonForm;
