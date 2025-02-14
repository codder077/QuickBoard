import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Details = () => {
  const location = useLocation();
  const { train, selectedCoach, fare } = location.state || {}; // Retrieve train, selected coach, and fare from state

  // Initialize state for passenger details
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    age: '',
    location: '',
    gender: '',
    dob: '',
  });

  // Check if train and selectedCoach are defined
  if (!train || !selectedCoach) {
    return <div className="text-red-500">Error: Train or selected coach information is missing.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePayment = (method) => {
    // Handle payment logic here based on the selected method
    console.log(`Payment method selected: ${method}`);
    console.log('Passenger Details:', passengerDetails);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">Booking Details</h1>
      <h2 className="text-2xl font-bold text-black">Train: {train.train.train_name}</h2>
      <p className="text-black">Train No: {train.train.train_ID}</p>
      <p className="text-black">Selected Coach: {selectedCoach}</p>
      <p className="text-black">Total Fare: ₹{fare}</p>
      
      {/* Passenger details form */}
      <form className="mt-6">
        <div className="mb-4">
          <label className="block text-white">Passenger Name:</label>
          <input 
            type="text" 
            name="name" 
            value={passengerDetails.name} 
            onChange={handleInputChange} 
            className="w-full p-2 rounded" 
            placeholder="Enter passenger name" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Age:</label>
          <input 
            type="number" 
            name="age" 
            value={passengerDetails.age} 
            onChange={handleInputChange} 
            className="w-full p-2 rounded" 
            placeholder="Enter age" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Location:</label>
          <input 
            type="text" 
            name="location" 
            value={passengerDetails.location} 
            onChange={handleInputChange} 
            className="w-full p-2 rounded" 
            placeholder="Enter location" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Gender:</label>
          <select 
            name="gender" 
            value={passengerDetails.gender} 
            onChange={handleInputChange} 
            className="w-full p-2 rounded" 
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-white">Date of Birth:</label>
          <input 
            type="date" 
            name="dob" 
            value={passengerDetails.dob} 
            onChange={handleInputChange} 
            className="w-full p-2 rounded" 
            required 
          />
        </div>
        
        <h3 className="text-xl font-bold text-yellow-400 mt-6">Payment Options</h3>
        <div className="flex gap-4 mt-4">
          <button 
            type="button" 
            className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition" 
            onClick={() => handlePayment('razorpay')}
          >
            Pay using Razorpay
          </button>
          <button 
            type="button" 
            className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition" 
            onClick={() => handlePayment('crypto')}
          >
            Pay using Crypto
          </button>
        </div>
      </form>
    </div>
  );
};

export default Details;
