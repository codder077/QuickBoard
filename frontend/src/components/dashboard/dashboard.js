import React from "react";

const Dashboard = () => {
  // Hardcoded user data
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    totalBookings: 8,
    activeBookings: 3,
  };

  // Hardcoded booking data
  const bookings = [
    {
      id: "TKT001",
      trainName: "Rajdhani Express",
      from: "Delhi",
      to: "Mumbai",
      date: "2024-03-25",
      status: "upcoming",
      price: 1200,
      seatNo: "B4-23",
    },
    {
      id: "TKT002",
      trainName: "Shatabdi Express",
      from: "Bangalore",
      to: "Chennai",
      date: "2024-03-15",
      status: "completed",
      price: 800,
      seatNo: "A2-15",
    },
    {
      id: "TKT003",
      trainName: "Duronto Express",
      from: "Kolkata",
      to: "Delhi",
      date: "2024-03-10",
      status: "cancelled",
      price: 1500,
      seatNo: "C1-08",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black/90 pt-20">
      <div className="container mx-auto p-6">
        {/* User Overview Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-8">
            Welcome Back,{" "}
            <span className="text-yellow-400">{userData.name}</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-400">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {userData.totalBookings}
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-400">
                Active Bookings
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {userData.activeBookings}
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-400">
                Profile Status
              </h3>
              <p className="text-3xl font-bold text-white mt-2">Active</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Your <span className="text-yellow-400">Bookings</span>
          </h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">
                      {booking.trainName}
                    </h3>
                    <p className="text-gray-300 mt-1">
                      Booking ID: {booking.id}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-white">
                        From:{" "}
                        <span className="text-gray-300">{booking.from}</span>
                      </p>
                      <p className="text-white">
                        To: <span className="text-gray-300">{booking.to}</span>
                      </p>
                      <p className="text-white">
                        Date:{" "}
                        <span className="text-gray-300">{booking.date}</span>
                      </p>
                      <p className="text-white">
                        Seat:{" "}
                        <span className="text-gray-300">{booking.seatNo}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ₹{booking.price}
                    </p>
                    <p
                      className={`mt-2 font-semibold capitalize ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </p>
                    {booking.status === "upcoming" && (
                      <button className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">
            Quick <span className="text-yellow-400">Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm text-white hover:bg-yellow-400/10 transition-all duration-300">
              Book New Ticket
            </button>
            <button className="p-4 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm text-white hover:bg-yellow-400/10 transition-all duration-300">
              Check PNR Status
            </button>
            <button className="p-4 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm text-white hover:bg-yellow-400/10 transition-all duration-300">
              Download E-Ticket
            </button>
            <button className="p-4 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm text-white hover:bg-yellow-400/10 transition-all duration-300">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
