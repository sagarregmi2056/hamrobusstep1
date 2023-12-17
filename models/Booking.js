const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const bookingSchema = new mongoose.Schema(
  {
    price: {
      type: String,
    },
    passengers: {
      type: Number,
      default: 1,
    },
    passengerName: {
      type: String,
    },
    seatNumbers: {
      type: [String], // Make it an array of strings
      required: true,
    },

    boardingPoints: {
      type: String,
      required: false,
    },
    ticketNumber: {
      type: String,
    },

    guest: {
      type: ObjectId,

      ref: "Guest",
    },
    user: { type: ObjectId, ref: "User" },
    owner: { type: ObjectId, ref: "Owner" },
    bus: { type: ObjectId, ref: "Bus" },
    self: { type: ObjectId, ref: "Owner" },

    verification: {
      type: String,
      enum: ["verified", "notverified", "payed"],
      default: "notverified",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
