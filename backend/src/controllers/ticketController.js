const Ticket = require("../models/trainTicketModel");
const Users = require("../models/userModel");

const bookTicket = async (req, res) => {
  try {
    console.log("Booking ticket request received at backend", req.body);
    const {
      userEmail,
      amount,
      trainNo,
      trainName,
      departureStation,
      destinationStation,
      departuredate,
      coach,
    } = req.body;

    if (
      !userEmail ||
      !amount ||
      !trainNo ||
      !trainName ||
      !departureStation ||
      !destinationStation ||
      !departuredate ||
      !coach
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required details", status: 400 });
    }

    const newTicket = new Ticket({
      amount,
      trainNo,
      userEmail,
      trainName,
      departureStation,
      destinationStation,
      departuredate,
      coach,
    });

    const savedTicket = await newTicket.save();
    const pnr = savedTicket._id.toString();
    const user = await Users.findOne({ email: userEmail });

    const ticket = {
      amount,
      trainNo,
      trainName,
      departureStation,
      pnr,
      destinationStation,
      departuredate,
      coach,
      canceled: false,
      cancelationOnTrack: false,
    };

    user.trainTickets.push(ticket);
    await user.save();
    return res.json({ status: 200 });
  } catch (error) {
    console.log("Error occurred at backend at ticket booking ");
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

const handleCancellation = async (req, res) => {
  try {
    const { userEmail, pnr } = req.body;
    if (!userEmail) {
      return res.status(400).json({
        message: "Some error occurred! Please login again after logging out",
        status: 400,
      });
    }

    const user = await Users.findOne({ email: userEmail });
    user.cancelationOnTrack = true;
    const ticket = await Ticket.findOne({ _id: pnr });
    ticket.cancelationOnTrack = true;
    await ticket.save();
    await user.save();
    return res.json({ status: 200 });
  } catch (error) {
    console.log("Error occurred at the backend of onticket cancellation");
    return res.status(500).json({
      message: "Some Error Occurred! Please try again later",
      status: 500,
    });
  }
};

module.exports = {
  bookTicket,
  handleCancellation,
};
