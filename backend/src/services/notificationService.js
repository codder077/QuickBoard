const nodemailer = require("nodemailer");
const User = require("../models/userModel");

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendCancellationNotification(booking) {
    try {
      const user = await User.findById(booking.user);
      // console.log(user);
      // Send email notification
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "Booking Cancellation Confirmation",
        html: `
          <h1>Booking Cancellation Confirmation</h1>
          <p>Your booking with ID ${booking._id} has been cancelled.</p>
          <p>Booking Details:</p>
          <ul>
            <li>Train: ${booking.train.name}</li>
            <li>From: ${booking.fromStation.name}</li>
            <li>To: ${booking.toStation.name}</li>
            <li>Travel Date: ${booking.travelDate}</li>
          </ul>
          <p>Your refund will be processed within 5-7 business days.</p>
        `,
      });

      // Send SMS notification
      //   await this.sendSMS(
      //     user.phone,
      //     `Your booking ${booking._id} has been cancelled. Refund will be processed in 5-7 business days.`
      //   );
    } catch (error) {
      throw new Error(
        `Failed to send cancellation notification: ${error.message}`
      );
    }
  }

  async sendTransferNotifications(booking, newUserId) {
    try {
      const originalUser = await User.findById(booking.user);
      const newUser = await User.findById(newUserId);

      // Notify original user
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: originalUser.email,
        subject: "Booking Transfer Confirmation",
        html: `
          <h1>Booking Transfer Confirmation</h1>
          <p>Your booking with ID ${booking._id} has been transferred successfully.</p>
          <p>Transferred to: ${newUser.name}</p>
          <p>Booking Details:</p>
          <ul>
            <li>Train: ${booking.train.name}</li>
            <li>From: ${booking.fromStation.name}</li>
            <li>To: ${booking.toStation.name}</li>
            <li>Travel Date: ${booking.travelDate}</li>
          </ul>
        `,
      });

      // Notify new user
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: newUser.email,
        subject: "Booking Transfer Received",
        html: `
          <h1>Booking Transfer Received</h1>
          <p>A booking has been transferred to you.</p>
          <p>Booking ID: ${booking._id}</p>
          <p>Transferred from: ${originalUser.name}</p>
          <p>Booking Details:</p>
          <ul>
            <li>Train: ${booking.train.name}</li>
            <li>From: ${booking.fromStation.name}</li>
            <li>To: ${booking.toStation.name}</li>
            <li>Travel Date: ${booking.travelDate}</li>
          </ul>
        `,
      });

      // Send SMS notifications
      await this.sendSMS(
        originalUser.phone,
        `Your booking ${booking._id} has been transferred to ${newUser.name}.`
      );

      await this.sendSMS(
        newUser.phone,
        `Booking ${booking._id} has been transferred to you from ${originalUser.name}.`
      );
    } catch (error) {
      throw new Error(
        `Failed to send transfer notifications: ${error.message}`
      );
    }
  }

  async sendBookingConfirmation(booking) {
    try {
      // console.log(booking, "wawwewew");
      const user = await User.findById(booking.user);

      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "Booking Confirmation",
        html: `
          <h1>Booking Confirmation</h1>
          <p>Your booking has been confirmed successfully!</p>
          <p>Booking ID: ${booking._id}</p>
          <p>Booking Details:</p>
          <ul>
            <li>Train: ${booking.train.name}</li>
            <li>From: ${booking.fromStation.name}</li>
            <li>To: ${booking.toStation.name}</li>
            <li>Travel Date: ${booking.travelDate}</li>
          </ul>
          <p>Thank you for choosing our service!</p>
        `,
      });
      //   console.log('waw');
    } catch (error) {
      throw new Error(`Failed to send booking confirmation: ${error.message}`);
    }
  }

  async sendTicketCancellationNotification(data) {
    try {
      const { ticket, user, refundAmount, booking } = data;

      // Prepare email content
      const emailContent = {
        to: user.email,
        subject: `Ticket Cancellation Confirmation - PNR: ${ticket.pnr}`,
        html: `
          <h2>Ticket Cancellation Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Your ticket has been successfully cancelled.</p>
          
          <h3>Ticket Details:</h3>
          <ul>
            <li>PNR: ${ticket.pnr}</li>
            <li>Train: ${ticket.train.name}</li>
            <li>From: ${ticket.fromStation.name}</li>
            <li>To: ${ticket.toStation.name}</li>
            <li>Travel Date: ${new Date(
              ticket.travelStartDate
            ).toLocaleDateString()}</li>
            <li>Passenger: ${ticket.passenger.name}</li>
          </ul>

          <h3>Refund Details:</h3>
          <ul>
            <li>Refund Amount: ₹${refundAmount}</li>
            <li>Booking Total After Refund: ₹${booking.totalFare}</li>
            <li>Payment Status: ${booking.paymentStatus}</li>
          </ul>

          <p>The refund will be processed to your original payment method within 5-7 business days.</p>
          
          <p>Thank you for using our service.</p>
        `,
      };

      // Send email
      await this.sendEmail(emailContent);

      // You could also add SMS notification here if required
      // await this.sendSMS(user.phone, `Your ticket (PNR: ${ticket.pnr}) has been cancelled. Refund of ₹${refundAmount} will be processed shortly.`);
    } catch (error) {
      console.error("Failed to send ticket cancellation notification:", error);
      throw new Error("Failed to send cancellation notification");
    }
  }

  async sendTicketTransferNotification(data) {
    try {
      const {
        originalTicket,
        newTicket,
        fromUser,
        toUser,
        originalBooking,
        newBooking,
      } = data;

      // Notification for original ticket holder
      const originalUserEmail = {
        to: fromUser.email,
        subject: `Ticket Transfer Confirmation - PNR: ${originalTicket.pnr}`,
        html: `
          <h2>Ticket Transfer Confirmation</h2>
          <p>Dear ${fromUser.name},</p>
          <p>Your ticket has been partially transferred.</p>
          
          <h3>Original Ticket Update:</h3>
          <ul>
            <li>PNR: ${originalTicket.pnr}</li>
            <li>Train: ${originalTicket.train.name}</li>
            <li>From: ${originalTicket.fromStation.name}</li>
            <li>To: ${originalTicket.toStation.name} (Updated)</li>
            <li>Travel Date: ${new Date(
              originalTicket.travelStartDate
            ).toLocaleDateString()} - 
                ${new Date(
                  originalTicket.travelEndDate
                ).toLocaleDateString()}</li>
          </ul>

          <p>The remaining portion of your journey has been transferred to another user.</p>
        `,
      };

      // Notification for new ticket holder
      const newUserEmail = {
        to: toUser.email,
        subject: `New Ticket Transfer Received - PNR: ${newTicket.pnr}`,
        html: `
          <h2>New Ticket Received</h2>
          <p>Dear User,</p>
          <p>A ticket has been transferred to you.</p>
          
          <h3>New Ticket Details:</h3>
          <ul>
            <li>PNR: ${newTicket.pnr}</li>
            <li>Train: ${newTicket.train.name}</li>
            <li>From: ${newTicket.fromStation.name}</li>
            <li>To: ${newTicket.toStation.name}</li>
            <li>Travel Date: ${new Date(
              newTicket.travelStartDate
            ).toLocaleDateString()} - 
                ${new Date(newTicket.travelEndDate).toLocaleDateString()}</li>
            <li>Booking Amount: ₹${newBooking.totalFare}</li>
          </ul>

          <p>Please complete the payment to confirm your ticket.</p>
        `,
      };

      // Send emails
      await Promise.all([
        this.sendEmail(originalUserEmail),
        this.sendEmail(newUserEmail),
      ]);
    } catch (error) {
      console.error("Failed to send ticket transfer notification:", error);
      throw new Error("Failed to send transfer notification");
    }
  }
}

module.exports = new NotificationService();
