import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../../utils/config'
const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train, selectedCoach, fare, departingStation,arrivingStation ,selectedDate} = location.state || {}; // Retrieve train, selected coach, and fare from state
  console.log(location.state);
  const loadRazorpayScript = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { };
    document.body.appendChild(script);
};
React.useEffect(() => {
    loadRazorpayScript();
}, []);
  // Initialize state for passenger details
  const [passengerDetails, setPassengerDetails] = useState([]);
console.log(passengerDetails)
  // Check if train and selectedCoach are defined
  if (!train || !selectedCoach) {
    return <div className="text-red-500">Error: Train or selected coach information is missing.</div>;
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setPassengerDetails((prevDetails) =>
      prevDetails.map((passenger, i) =>
        i === index ? { ...passenger, [name]: value } : passenger
      )
    );
  };
   
  const handleAddPassenger = () => {
    setPassengerDetails([...passengerDetails, { name: '', age: '', location: '', gender: '', dob: '' }]);
  };

  const handleRemovePassenger = (index) => {
    const newPassengerDetails = passengerDetails.filter((_, i) => i !== index);
    setPassengerDetails(newPassengerDetails);
  };
  

  const handlePayment = async (method) => {
    console.log(`Payment method selected: ${method}`);
    console.log('Passenger Details:', passengerDetails);
    console.log(train);
    
    if (method === 'razorpay') {
      try {
        // Call createBooking API
        const response = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            trainId: train.train.id, // Assuming train object has an _id
            fromStation: departingStation.id, // Adjust as necessary
            toStation: arrivingStation.id, // Adjust as necessary
            travelStartDate: selectedDate, // Adjust as necessary
            travelEndDate: selectedDate, // Adjust as necessary
            passengers: passengerDetails,
            coach:selectedCoach,
            amount: passengerDetails.length*fare
          }),
        });

        const bookingResult = await response.json();

        if (bookingResult.success) {
          // Proceed with Razorpay payment
          const options = {
            key: 'rzp_test_S7O9aeETo3NXrl', // Your Razorpay key id
            amount: bookingResult.data.totalFare * 100, // Amount in paise
            currency: "INR",
            name: "Train Booking",
            description: "Booking for train journey",
            order_id: bookingResult.data.orderId, // Assuming the order ID is returned
            handler: function (response) {
              // Handle successful payment here
              console.log("Payment successful:", response);
              navigate('/success');
            },
            prefill: {
              name: passengerDetails[0]?.name || '', // Prefill with first passenger's name
              email: '', // Add email if available
              contact: '', // Add contact if available
            },
            theme: {
              color: "#F37254",
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          console.error("Booking failed:", bookingResult.error);
        }
      } catch (error) {
        console.error("Error during booking:", error);
      }
    }
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
        {passengerDetails.map((passenger, index) => (
          <div key={index} className="flex items-center mb-4">
            <input 
              type="text" 
              name="name" 
              value={passenger.name} 
              onChange={(e) => handleInputChange(e, index)} 
              className="w-full p-2 rounded" 
              placeholder="Enter passenger name" 
              required 
            />
            <input 
              type="number" 
              name="age" 
              value={passenger.age} 
              onChange={(e) => handleInputChange(e, index)} 
              className="w-full p-2 rounded mx-2" 
              placeholder="Enter age" 
              required 
            />
            <select 
              name="gender" 
              value={passenger.gender} 
              onChange={(e) => handleInputChange(e, index)} 
              className="w-full p-2 rounded mx-2" 
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <button type="button" onClick={() => handleRemovePassenger(index)} className="text-red-500">✖</button>
          </div>
        ))}
        <button type="button" onClick={handleAddPassenger} className="bg-green-500 text-white py-2 px-4 rounded">Add Passenger</button>
        
        <h3 className="text-xl font-bold text-yellow-400 mt-6">Payment Options</h3>
        <div className="flex gap-4 mt-4">
          <button 
            type="button" 
            className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500 transition" 
            onClick={() => handlePayment('razorpay')}
          >
            Pay using Razorpay
          </button>
        </div>
      </form>
    </div>
  );
};

export default Details;
