import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import Divider from "@mui/material/Divider";
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
  const navigate=useNavigate();
  const [departingStation, setDepartingStation] = useState("");
  const [arrivingStation, setArrivingStation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTrain, setSelectedTrain] = useState("");
  const [showTrainData, setShowTrainData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState(""); // Added state to track menu type (departure or arrival)
  const [coachState, setCoachState] = useState(false);
  const [fairCost,setFairCost]=useState(0);

  const open = Boolean(anchorEl);
  const userEmail=localStorage.getItem('emailData');
  const onBuyTicket = async() => {
    console.log("faircoost",fairCost);
    const data = {
      amount:fairCost,
      trainNo:showTrainData[0].train?.train_ID,
      userEmail:userEmail,
      trainName:showTrainData[0].train?.train_name,
      departureStation:departingStation,
      destinationStation:arrivingStation,
      departuredate:selectedDate,
      coach:"Sleeper",
      

    }

    const response=await axios.post('http://localhost:8000/api/bookticket',data);
    navigate("/");

  }
  const onCoachState = (cost) => {
    console.log("567coachstate", fairCost);
    
    if(coachState){
      setFairCost(parseInt(fairCost)-parseInt(cost));
    }else{
      setFairCost(parseInt(fairCost)+parseInt(cost));
    }
    console.log("647coachstate", fairCost);
    setCoachState((prev) => !prev);
    console.log("coachState", coachState);
  }
  const fetchData = async () => {
    try {
      console.log("t5y67898gdfp");
      const filteredTrains = trainData.map((train) => {
        // console.log("4657234vcfvbgv",train);
        const { travel } = train;
        // console.log("travel",travel);
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
            console.log("988790weqfytdgfvbv", parseInt(train.travel[arrivalIndex].cost) - parseInt(train.travel[departureIndex].cost));
            const cost = parseInt(train.travel[arrivalIndex].cost) - parseInt(train.travel[departureIndex].cost);

            setShowTrainData([...showTrainData, { train, cost: cost }]);
          }
        }

        console.log("showTrainData", showTrainData);

        // const departureIndex = travel.findIndex((station) => station.station === departingStation) || -1;
        // const arrivalIndex = travel.findIndex((station) => station.station === arrivingStation) || -1;
        // console.log("departureIndex",departureIndex,"arrival station",arrivalIndex)
        // return departureIndex !== -1 && arrivalIndex !== -1 && departureIndex < arrivalIndex;
      });

      // console.log("efghfjft897i",filteredTrains);

      if (filteredTrains.length > 0) {
        setSelectedTrain(filteredTrains); // Select the first matching train
      } else {
        setSelectedTrain(null); // No matching train found
      }
    } catch (error) {
      console.error("Error fetching train data:", error);
      setSelectedTrain(null);
    }
  };
  useEffect(() => {
    console.log("ytraiindeed selectedDate", selectedDate);
    fetchData();
  }, [departingStation, arrivingStation, selectedDate]);

  const handleMenuItemClick = (station) => {
    if (menuType === "departure") {
      setDepartingStation(station);
    } else if (menuType === "arrival") {
      setArrivingStation(station);
    }
    setAnchorEl(null); // Close the menu after selection
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
    // Handle form submission logic
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl text-blue-500 p-8 font-bold mt-4 mb-4 text-center">
        Search Your Train {selectedTrain}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[5rem]">
            <div>
              <p className="mb-[1rem] text-[1.4rem] font-bold">
                Departure Station
              </p>
              <div>
                <Button
                  id="departure-station-button"
                  aria-controls={open ? "departure-station-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
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
                  <MenuItem
                    onClick={() => handleMenuItemClick("Sonipat")}
                    disableRipple
                  >
                    Sonipat
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Ambala_City")}
                    disableRipple
                  >
                    Ambala_City
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Ambala_Cant.")}
                    disableRipple
                  >
                    Ambala_Cant.
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Delhi_Junction")}
                    disableRipple
                  >
                    Delhi_Junction
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Anandpur_Sahib")}
                    disableRipple
                  >
                    Anandpur_Sahib
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Una_Himachal")}
                    disableRipple
                  >
                    Una_Himachal
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Hapur")}
                    disableRipple
                  >
                    Hapur
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Gajraula")}
                    disableRipple
                  >
                    Gajraula
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Amroha")}
                    disableRipple
                  >
                    Amroha
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Moradabad")}
                    disableRipple
                  >
                    Moradabad
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Bareilly")}
                    disableRipple
                  >
                    Bareilly
                  </MenuItem>
                  {/* Add more menu items here */}
                </StyledMenu>
              </div>
            </div>
            <div>
              <p className="mb-[1rem] text-[1.4rem] font-bold">
                Arrival Station
              </p>
              <div>
                <Button
                  id="arrival-station-button"
                  aria-controls={open ? "arrival-station-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
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
                  <MenuItem
                    onClick={() => handleMenuItemClick("Sonipat")}
                    disableRipple
                  >
                    Sonipat
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Ambala_City")}
                    disableRipple
                  >
                    Ambala_City
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Ambala_Cant.")}
                    disableRipple
                  >
                    Ambala_Cant.
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Delhi_Junction")}
                    disableRipple
                  >
                    Delhi_Junction
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Anandpur_Sahib")}
                    disableRipple
                  >
                    Anandpur_Sahib
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Una_Himachal")}
                    disableRipple
                  >
                    Una_Himachal
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Hapur")}
                    disableRipple
                  >
                    Hapur
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Gajraula")}
                    disableRipple
                  >
                    Gajraula
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Amroha")}
                    disableRipple
                  >
                    Amroha
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Moradabad")}
                    disableRipple
                  >
                    Moradabad
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Bareilly")}
                    disableRipple
                  >
                    Bareilly
                  </MenuItem>
                  {/* Add more menu items here */}
                </StyledMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center my-[2rem]">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Select Date
          </label>
          <input
            type="date"
            id="date"
            className="mt-1 border-solid border-2 border-black focus:ring-indigo-500 focus:border-indigo-500 block px-[0.5rem] py-[0.2rem] shadow-sm sm:text-sm w-[10rem] rounded-md"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {
          departingStation && arrivingStation && selectedDate && <>
            <h1 className="text-center  mb-[2rem] font-bold text-[2rem]">Select Trains</h1>
            <br />
            {showTrainData.map((train) => (<div className="flex flex-col w-[95%] mx-auto bg-gray-100 p-[2rem] rounded-lg cursor-pointer">
              <div className="flex justify-between">
                <div className="flex gap-[1rem]">

                  <div className="bg-blue-500 w-[4rem] flex justify-center py-[0.1rem] text-white font-semibold"> {train?.train?.train_ID}</div>

                  <p className="font-semibold ">{train?.train?.train_name}</p>
                </div>
                <div className="text-[1.5rem] font-semibold flex justify-end">
                  ₹{train.cost}
                </div>
              </div>
              <div className="flex ">
                {train?.train?.travel.map((travels) => {
                  <>
                    <div>Station:{travels.station}</div>
                    <p>Arrival time:{travels.arrival_time}</p>
                    <p>Departure Time:{travels.departure_time}</p>
                  </>
                })}
              </div>


              <div className="flex justify-between mt-[1rem]"> {train?.train?.coach.map((coachs) => (
                <div className="flex gap-[1rem]">
                  <div className={`border-solid border-black border-2 font-semibold px-[0.5rem] py-[0.2rem] flex items-center cursor-pointer ${coachState ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}  `} onClick={() => onCoachState(train.cost)}>{coachs.type}</div>
                  <div className="flex items-center gap-[0.5rem] font-semibold">Total Seats:<span className="font-bold">{coachs.seats}</span></div>
                  <div className="flex font-semibold items-center gap-[1rem]">Tatkal:{coachs.tatkal}</div>
                  <div className="flex font-semibold items-center gap-[1rem]">Available Seats:(fetch availabke  seats)</div>
                </div>
              ))}
                <div>
                  <p className="text-blue-500 font-semibold">Runs Daily </p>
                </div>
              </div>

              <div className="flex justify-between mt-[2rem]">
                {train?.train?.travel.map((travels) => (
                  <>
                    <div className="flex flex-col">
                      <div className="mb-[0.5rem] font-semibold">{travels.station}</div>
                      <div className="flex ">
                        <div className="flex flex-col ">
                          <div className="flex gap-[1rem]">

                            <p>Arrival Time </p><p>{`->`}</p> <p>Departure Time</p>
                          </div>
                          <div className="flex gap-[8rem]">
                            <p>{travels.arrival_time}</p><p>{travels.departure_time}</p>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>))}
          </>
        }
        <button
          type="submit"
          className=" relative left-[42rem] top-[3rem] inline-flex items-center px-4 py-2 border border-transparent text-base font-medium  rounded-md shadow-sm text-white bg-blue-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" onClick={() => onBuyTicket()}

        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default TrainBookingPage;
