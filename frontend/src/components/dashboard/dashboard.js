import React, { useEffect, useState } from "react";
import {API_BASE_URL} from '../../utils/config'
const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token", token);

        const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await userResponse.json();
        console.log("456",user);
        setUserData(user);

        const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total and active bookings
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(booking => booking.tickets[0]?.status === "CONFIRMED").length;

  console.log(bookings);
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      case "CONFIRMED":
        return "text-yellow-400";
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
                {totalBookings}
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-yellow-400/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-400">
                Active Bookings
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {activeBookings}
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
                      Booking ID: {booking._id}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-white">
                        From:{" "}
                        <span className="text-gray-300">{booking?.tickets[0]?.fromStation?.name}</span>
                      </p>
                      <p className="text-white">
                        To: <span className="text-gray-300">{booking?.tickets[0]?.toStation?.name}</span>
                      </p>
                      <p className="text-white">
                        Date:{" "}
                        <span className="text-gray-300">{booking?.tickets[0]?.bookingDate}</span>
                      </p>
                      <p className="text-white">
                        Seat:{" "}
                        <span className="text-gray-300">{booking?.tickets[0]?.seatNumber}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ₹{booking.totalFare}
                    </p>
                    <p
                      className={`mt-2 font-semibold capitalize ${getStatusColor(
                        booking.tickets[0]?.status
                      )}`}
                    >
                      {booking.tickets[0]?.status}
                    </p>
                    {booking.tickets[0]?.status === "CONFIRMED" && (
                      <button className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">
                        Cancel Ticket
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
