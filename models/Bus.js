// const slug = require("mongoose-slug-generator");
var slug = require("mongoose-slug-updater");

const mongoose = require("mongoose");
const { bool } = require("sharp");

// this is causing the error while using ..

const { ObjectId } = mongoose.Schema;
mongoose.plugin(slug);

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    acType: {
      type: String,
      enum: ["AC", "Non-AC"],
      default: "Non-Ac",
    },
    toiletType: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    tvType: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    wifi: {
      type: String,
      enum: ["Yes", "No"],
      default: "Not Applicable",
    },
    busNumber: {
      type: String,
      trim: true,
      required: true,
      maxlength: 70,
    },
    fare: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    features: {
      type: [],
    },
    isbusverified: {
      default: false,
      type: Boolean,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    seatsAvailable: {
      type: Number,
      trim: true,
      default: 186,
      maxlength: 187,
    },
    bookedSeat: {
      type: [],
    },
    soldSeat: {
      type: [],
    },
    numberOfSeats: {
      type: Number,
      trim: true,
      default: 186,
      maxlength: 189,
    },

    departure_time: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },

    startLocation: { type: ObjectId, ref: "Location" },
    endLocation: { type: ObjectId, ref: "Location" },

    journeyDate: {
      type: String,
    },
    owner: {
      type: ObjectId,
      ref: "Owner",
    },
    boardingPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    droppingPoints: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        type: {
          type: String,
          required: true,
        },
        url: String,
      },
    ],

    slug: {
      type: String,
      slug: "name",
      unique: true,
      slugPaddingSize: 3,
    },
  },
  { timestamps: true }
);
busSchema.plugin(slug);
const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
