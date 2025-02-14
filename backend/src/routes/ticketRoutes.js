const express = require("express");
const router = express.Router();
const {
  bookTicket,
  handleCancellation,
} = require("../controllers/ticketController");

router.post("/bookticket", bookTicket);
router.post("/oncancelation", handleCancellation);

module.exports = router;
