import React, { useState } from "react";

const FlightBookingPage = () => {
  const [departureAirport, setDepartureAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [numBags, setNumBags] = useState(0);
  const [roundTrip, setRoundTrip] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission logic
    console.log("Form submitted:", {
      departureAirport,
      destinationAirport,
      departureDate,
      returnDate: roundTrip ? returnDate : "", // Include return date only if round trip
      passengerCount,
      numBags,
      roundTrip,
    });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl text-blue-500 p-8 font-bold mt-4 mb-4 text-center">
         Book Your Flight
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="departureAirport"
            className="block text-sm font-medium text-gray-700"
          >
            Departure Airport
          </label>
          <input
            type="text"
            id="departureAirport"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="destinationAirport"
            className="block text-sm font-medium text-gray-700"
          >
            Destination Airport
          </label>
          <input
            type="text"
            id="destinationAirport"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={destinationAirport}
            onChange={(e) => setDestinationAirport(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="departureDate"
              className="block text-sm font-medium text-gray-700"
            >
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
          {roundTrip && ( // Only show return date if round trip
            <div>
              <label
                htmlFor="returnDate"
                className="block text-sm font-medium text-gray-700"
              >
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="passengerCount"
            className="block text-sm font-medium text-gray-700"
          >
            Passenger Count
          </label>
          <input
            type="number"
            id="passengerCount"
            min="1"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="numBags"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Bags
          </label>
          <input
            type="number"
            id="numBags"
            min="0"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={numBags}
            onChange={(e) => setNumBags(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="roundTrip"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
          />
          <label
            htmlFor="roundTrip"
            className="ml-2 block text-sm text-gray-900"
          >
            Round Trip
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default FlightBookingPage;
