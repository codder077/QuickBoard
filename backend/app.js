const express = require("express");
const { connect } = require("./src/db/connection");
const cors = require("cors");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");

const app = express();

// Connect to database
connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("This is Backend");
});

// API routes
app.use("/api", userRoutes);
app.use("/api", ticketRoutes);

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log("Listening on port " + port);
});
