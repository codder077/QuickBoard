import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    marginTop: theme.spacing(1),
    minWidth: 280,
    background: 'rgba(0, 0, 0, 0.9)',
    border: '2px solid rgba(250, 204, 21, 0.3)',
    backdropFilter: 'blur(8px)',
    color: '#ffffff',
    boxShadow:
      "0 4px 6px -1px rgba(250, 204, 21, 0.1), 0 2px 4px -1px rgba(250, 204, 21, 0.06)",
    "& .MuiMenu-list": {
      padding: "8px",
      maxHeight: "300px",
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(250, 204, 21, 0.5)",
        borderRadius: "4px",
        "&:hover": {
          background: "rgba(250, 204, 21, 0.7)",
        },
      },
    },
    "& .MuiMenuItem-root": {
      padding: "12px 16px",
      margin: "4px 0",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 500,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        color: "#facc15",
      },
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "rgba(250, 204, 21, 0.3)",
      },
      "&.Mui-selected": {
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        color: "#facc15",
        "&:hover": {
          backgroundColor: "rgba(250, 204, 21, 0.3)",
        },
      },
    },
  },
}));

const TrainBookingPage = () => {
  const navigate = useNavigate();
  const [departingStation, setDepartingStation] = useState({ id: "", name: "" });
  const [arrivingStation, setArrivingStation] = useState({ id: "", name: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [showTrainData, setShowTrainData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState("");
  const [coachState, setCoachState] = useState(false);
  const [fairCost, setFairCost] = useState(0);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.error('Please login to book tickets');
    }
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stations');
      setStations(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch stations');
    }
  };

  const onBuyTicket = async () => {
    try {
      if (!departingStation.id || !arrivingStation.id || !selectedDate) {
        toast.error('Please fill all required fields');
        return;
      }

      const bookingData = {
        trainId: showTrainData[0].train?.train_ID,
        fromStation: departingStation.id,
        toStation: arrivingStation.id,
        travelStartDate: selectedDate,
        travelEndDate: selectedDate, // You might want to calculate this based on journey duration
        passengers: [{
          name: userData.name,
          age: 25, // You might want to add this to user profile
          gender: 'M', // You might want to add this to user profile
          seatPreference: coachState ? 'Sleeper' : 'Seater'
        }]
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      setLoading(true);
      const response = await axios.post(
        'http://localhost:8000/api/bookings',
        bookingData,
        config
      );

      if (response.data.success) {
        toast.success('Ticket booked successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrains = async () => {
    try {
      if (!departingStation.id || !arrivingStation.id || !selectedDate) return;

      setLoading(true);
      console.log(departingStation.id, arrivingStation.id, selectedDate); 
      const response = await axios.get(
        `http://localhost:8000/api/trains/search`,
        {
          params: {
            startStation: departingStation.id,
            endStation: arrivingStation.id,
            date: selectedDate
          }
        }
      );

      if (response.data.success) {
        const allTrains = [
          ...(response.data.data.directTrains || []),
          ...(response.data.data.alternativeTrains || [])
        ];

        setShowTrainData(allTrains.map(train => ({
          train: {
            train_ID: train.trainNo,
            train_name: train.trainName,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            route: train.route
          },
          cost: train.fare || calculateFare(train)
        })));
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch trains');
      setShowTrainData([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate fare (implement based on your requirements)
  const calculateFare = (train) => {
    // Basic implementation - you should modify this based on your needs
    return 500; // Base fare
  };

  const handleMenuItemClick = (station) => {
    if (menuType === "departure") {
      setDepartingStation({
        id: station._id,
        name: `${station.name} (${station.code})`
      });
    } else if (menuType === "arrival") {
      setArrivingStation({
        id: station._id,
        name: `${station.name} (${station.code})`
      });
    }
    setAnchorEl(null);
  };

  const handleClick = (event, type) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onCoachState = (cost) => {
    if(coachState) {
      setFairCost(parseInt(fairCost)-parseInt(cost));
    } else {
      setFairCost(parseInt(fairCost)+parseInt(cost));
    }
    setCoachState((prev) => !prev);
  }

  const handleSearch = () => {
    if (!departingStation.id || !arrivingStation.id || !selectedDate) {
      toast.error('Please select departure, arrival stations and date');
      return;
    }
    fetchTrains();
  };

  return (
    <div className="relative w-full min-h-screen bg-black/90 pt-20">
      <div className="container mx-auto p-10">
        <h1 className="text-5xl font-extrabold text-white mb-8 text-center transform hover:scale-105 transition-all duration-500">
          Search Your
          <span className="text-yellow-400 mx-2 animate-glow">Train</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="backdrop-blur-sm p-6 rounded-xl border-2 border-yellow-400/30">
                <p className="mb-4 text-2xl font-bold text-yellow-400">
                  Departure Station
                </p>
                <Button
                  id="departure-station-button"
                  aria-controls={open ? "departure-station-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  style={{
                    backgroundColor: "#FBBF24",
                    color: "#111827",
                    fontWeight: "600"
                  }}
                  disableElevation
                  onClick={(e) => handleClick(e, "departure")}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  {departingStation.name || "Select Station"}
                </Button>
                <StyledMenu
                  id="departure-station-menu"
                  anchorEl={anchorEl}
                  open={open && menuType === "departure"}
                  onClose={handleClose}
                >
                  {stations.map((station) => (
                    <MenuItem
                      key={station._id}
                      onClick={() => handleMenuItemClick(station)}
                    >
                      {station.name}
                    </MenuItem>
                  ))}
                </StyledMenu>
              </div>

              <div className="backdrop-blur-sm p-6 rounded-xl border-2 border-yellow-400/30">
                <p className="mb-4 text-2xl font-bold text-yellow-400">
                  Arrival Station
                </p>
                <Button
                  id="arrival-station-button"
                  aria-controls={open ? "arrival-station-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  style={{
                    backgroundColor: "#FBBF24",
                    color: "#111827",
                    fontWeight: "600"
                  }}
                  disableElevation
                  onClick={(e) => handleClick(e, "arrival")}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  {arrivingStation.name || "Select Station"}
                </Button>
                <StyledMenu
                  id="arrival-station-menu"
                  anchorEl={anchorEl}
                  open={open && menuType === "arrival"}
                  onClose={handleClose}
                >
                  {stations.map((station) => (
                    <MenuItem
                      key={station._id}
                      onClick={() => handleMenuItemClick(station)}
                    >
                      {station.name}
                    </MenuItem>
                  ))}
                </StyledMenu>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center my-8">
            <label htmlFor="date" className="block text-xl font-bold text-yellow-400 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              className="mt-1 bg-transparent border-2 border-yellow-400/30 text-white focus:ring-yellow-400 focus:border-yellow-400 block px-4 py-2 shadow-sm text-lg rounded-xl backdrop-blur-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="group px-8 py-4 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Searching...'
              ) : (
                <>
                  Search Trains
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {showTrainData.length > 0 && (
            <div className="animate-fadeInUp mt-12">
              <h2 className="text-4xl font-extrabold text-white text-center mb-8">
                Available 
                <span className="text-yellow-400 mx-2">Trains</span>
              </h2>
              
              {showTrainData.map((train) => (
                <div key={train.train.train_ID} className="bg-black/50 backdrop-blur-sm border-2 border-yellow-400/30 rounded-xl p-6 mb-6 transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400">{train.train.train_name}</h3>
                      <p className="text-white">Train No: {train.train.train_ID}</p>
                      <p className="text-white">From: {departingStation.name}</p>
                      <p className="text-white">To: {arrivingStation.name}</p>
                      <p className="text-white">Date: {selectedDate}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">₹{train.cost}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <label className="text-white flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={coachState}
                            onChange={() => onCoachState(500)}
                            className="form-checkbox text-yellow-400"
                          />
                          Sleeper Class (+₹500)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center text-white text-xl mt-8">
              Searching for available trains...
            </div>
          )}

          {!loading && showTrainData.length === 0 && departingStation.id && arrivingStation.id && selectedDate && (
            <div className="text-center text-white text-xl mt-8">
              No trains available for selected route
            </div>
          )}

          {showTrainData.length > 0 && (
            <button
              type="button"
              className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm mx-auto disabled:opacity-50"
              onClick={onBuyTicket}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Now'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-3 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TrainBookingPage;
