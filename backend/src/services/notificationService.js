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
}

module.exports = new NotificationService();
