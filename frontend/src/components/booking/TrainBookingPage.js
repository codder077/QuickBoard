import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import trainData from "../../config/traindata.json";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const TrainBookingPage = () => {
  const navigate = useNavigate();
  const [departingStation, setDepartingStation] = useState("");
  const [arrivingStation, setArrivingStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTrain, setSelectedTrain] = useState("");
  const [showTrainData, setShowTrainData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState("");
  const [coachState, setCoachState] = useState(false);
  const [fairCost, setFairCost] = useState(0);

  const open = Boolean(anchorEl);
  const userEmail = localStorage.getItem('emailData');

  const onBuyTicket = async() => {
    const data = {
      amount: fairCost,
      trainNo: showTrainData[0].train?.train_ID,
      userEmail: userEmail,
      trainName: showTrainData[0].train?.train_name,
      departureStation: departingStation,
      destinationStation: arrivingStation,
      departuredate: selectedDate,
      coach: "Sleeper",
    }

    const response = await axios.post('http://localhost:8000/api/bookticket', data);
    navigate("/");
  }

  const onCoachState = (cost) => {
    if(coachState) {
      setFairCost(parseInt(fairCost)-parseInt(cost));
    } else {
      setFairCost(parseInt(fairCost)+parseInt(cost));
    }
    setCoachState((prev) => !prev);
  }

  const fetchData = async () => {
    try {
      const filteredTrains = trainData.map((train) => {
        const { travel } = train;
        let departureIndex = -1;
        let arrivalIndex = -1;
        travel.map((route, index) => {
          if (route.station === departingStation) {
            departureIndex = index;
          }
          if (route.station === arrivingStation) {
            arrivalIndex = index;
          }
        })
        if (departureIndex != -1 && arrivalIndex != -1 && arrivalIndex > departureIndex) {
          let temp = true;
          showTrainData.map((trainData) => {
            if (trainData?.train?.train_ID === train.train_ID) {
              temp = false;
            }
          })
          if (temp) {
            const cost = parseInt(train.travel[arrivalIndex].cost) - parseInt(train.travel[departureIndex].cost);
            setShowTrainData([...showTrainData, { train, cost: cost }]);
          }
        }
      });

      if (filteredTrains.length > 0) {
        setSelectedTrain(filteredTrains);
      } else {
        setSelectedTrain(null);
      }
    } catch (error) {
      console.error("Error fetching train data:", error);
      setSelectedTrain(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [departingStation, arrivingStation, selectedDate]);

  const handleMenuItemClick = (station) => {
    if (menuType === "departure") {
      setDepartingStation(station);
    } else if (menuType === "arrival") {
      setArrivingStation(station);
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
                  {departingStation || "Select Station"}
                </Button>
                <StyledMenu
                  id="departure-station-menu"
                  anchorEl={anchorEl}
                  open={open && menuType === "departure"}
                  onClose={handleClose}
                >
                  {/* Menu items remain the same */}
                  {/* ... */}
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
                  {arrivingStation || "Select Station"}
                </Button>
                <StyledMenu
                  id="arrival-station-menu"
                  anchorEl={anchorEl}
                  open={open && menuType === "arrival"}
                  onClose={handleClose}
                >
                  {/* Menu items remain the same */}
                  {/* ... */}
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

          {departingStation && arrivingStation && selectedDate && (
            <div className="animate-fadeInUp">
              <h2 className="text-4xl font-extrabold text-white text-center mb-8">
                Available 
                <span className="text-yellow-400 mx-2">Trains</span>
              </h2>
              
              {showTrainData.map((train) => (
                <div className="bg-black/50 backdrop-blur-sm border-2 border-yellow-400/30 rounded-xl p-6 mb-6 transform hover:scale-[1.02] transition-all duration-300">
                  {/* Train details styling remains similar but with updated colors */}
                  {/* ... */}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="group px-6 py-3 text-base font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm mx-auto"
            onClick={() => onBuyTicket()}
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

export default TrainBookingPage;
