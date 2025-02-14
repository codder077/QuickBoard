const Station = require("../models/Station");
const nodemailer = require("nodemailer");

class EmergencyNotificationService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async notifyUpcomingStations(trainId, emergency) {
    const train = await Train.findById(trainId)
      .populate("route.station")
      .populate("currentStation");

    const currentStationIndex = train.route.findIndex((stop) =>
      stop.station._id.equals(train.currentStation._id)
    );

    // Notify next 3 stations
    const upcomingStations = train.route
      .slice(currentStationIndex + 1, currentStationIndex + 4)
      .map((stop) => stop.station);

    await Promise.all(
      upcomingStations.map((station) =>
        this.notifyStationMaster(station, emergency, train)
      )
    );
  }

  async notifyStationMaster(station, emergency, train) {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: station.stationMaster.email,
      subject: `EMERGENCY ALERT - Train ${train.number}`,
      text: `
        Emergency situation reported on Train ${train.number}
        Type: ${emergency.type}
        Details: ${emergency.details}
        ETA to your station: ${this.calculateETA(train, station)}
        Required Action: ${emergency.requiredAction}
      `,
    };

    await this.mailer.sendMail(mailOptions);
  }
}

module.exports = new EmergencyNotificationService();
