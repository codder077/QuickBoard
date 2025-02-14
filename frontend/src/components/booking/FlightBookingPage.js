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
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="./img/gif2.gif"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl p-8 rounded-2xl backdrop-blur-sm border-2 border-yellow-400/30 mx-4">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          Book Your <span className="text-yellow-400">Flight</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="departureAirport" className="block text-base font-medium text-white">
              Departure Airport
            </label>
            <input
              type="text"
              id="departureAirport"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="destinationAirport" className="block text-base font-medium text-white">
              Destination Airport
            </label>
            <input
              type="text"
              id="destinationAirport"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={destinationAirport}
              onChange={(e) => setDestinationAirport(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="departureDate" className="block text-base font-medium text-white">
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
            {roundTrip && (
              <div>
                <label htmlFor="returnDate" className="block text-base font-medium text-white">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="passengerCount" className="block text-base font-medium text-white">
                Passenger Count
              </label>
              <input
                type="number"
                id="passengerCount"
                min="1"
                className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="numBags" className="block text-base font-medium text-white">
                Number of Bags
              </label>
              <input
                type="number"
                id="numBags"
                min="0"
                className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
                value={numBags}
                onChange={(e) => setNumBags(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="roundTrip"
              className="h-5 w-5 rounded border-yellow-400 text-yellow-400 focus:ring-yellow-400"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
            />
            <label htmlFor="roundTrip" className="ml-2 text-base text-white">
              Round Trip
            </label>
          </div>
          <button
            type="submit"
            className="group w-full px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            Book Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightBookingPage;
