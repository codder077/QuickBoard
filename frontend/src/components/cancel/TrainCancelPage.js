import React, { useState } from "react";
import { API_BASE_URL } from "../../utils/config";

const TrainCancelPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [reason, setReason] = useState("");
  const [cancelStatus, setCancelStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Token being sent:", localStorage.getItem('token'));

      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCancelStatus(`Cancellation successful: ${data.message}`);
      setError(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError("Failed to cancel booking. Please try again.");
      setCancelStatus(null);
    }
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
          Cancel Your <span className="text-yellow-400">Train</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bookingId" className="block text-base font-medium text-white">
              Booking ID
            </label>
            <input
              type="text"
              id="bookingId"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-base font-medium text-white">
              Reason for Cancellation
            </label>
            <textarea
              id="reason"
              rows="3"
              className="mt-1 block w-full rounded-xl border border-yellow-400/30 bg-transparent px-5 py-3 text-base text-white outline-none focus:border-yellow-400 focus:shadow-md"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm"
            >
              Cancel Ticket
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </form>

        {cancelStatus && (
          <div className="mt-4 p-4 bg-green-700 rounded-lg">
            <p className="text-white">{cancelStatus}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-700 rounded-lg">
            <p className="text-white">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainCancelPage;
