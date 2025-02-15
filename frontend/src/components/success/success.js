
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-5xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-700 mb-8">Thank you for your booking. Your payment has been processed successfully.</p>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Booking Details</h2>
        <p className="text-gray-600">Your booking is confirmed. We look forward to serving you!</p>
      </div>
      <button 
        onClick={handleGoHome} 
        className="mt-8 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default Success;