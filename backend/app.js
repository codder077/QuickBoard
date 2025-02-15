const express = require("express");
const { connect } = require("./src/db/connection");
const cors = require("cors");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const trainRoutes = require("./src/routes/trainRoutes");
const stationRoutes = require("./src/routes/stationRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

const app = express();

// Connect to database
connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
  }
));

// Routes
app.get("/", (req, res) => {
  res.send("This is Backend");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/bookings", bookingRoutes);

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log("Listening on port " + port);
});
