import React, { useState } from "react";

const FlightCancelPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission logic
    console.log("Form submitted:", {
      bookingId,
      reason,
    });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl text-red-500 p-8 font-bold mt-4 mb-4 text-center">
        Cancel Flight Booking
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bookingId"
            className="block text-sm font-medium text-gray-700"
          >
            Booking ID
          </label>
          <input
            type="text"
            id="bookingId"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Reason for Cancellation
          </label>
          <textarea
            id="reason"
            rows="3"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <div className="space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel Ticket
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sell Your Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightCancelPage;
