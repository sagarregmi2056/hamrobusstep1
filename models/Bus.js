// const slug = require("mongoose-slug-generator");
var slug = require("mongoose-slug-updater");

const mongoose = require("mongoose");
const { bool } = require("sharp");

// this is causing the error while using ..

const { ObjectId } = mongoose.Schema;
mongoose.plugin(slug);

const busSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Define _id as a string type
      required: true,
    },
    name: {
      type: String,
      trim: true,
      // required: true,
    },
    busType: {
      type: String,
      trim: true,
    },

    amenities: [
      {
        type: String,
        enum: ["AC", "Toilet", "TV", "WiFi"],
      },
    ],
    busNumber: {
      type: String,
      trim: true,
      // required: true,
      maxlength: 70,
    },
    fare: {
      type: Number,
      trim: true,

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

    seatConfig: [
      {
        seatType: {
          type: String,
          enum: ["Seater", "Sofa", "Sleeper"],
          required: true,
        },
        seatPosition: {
          type: String,
          enum: ["Window", "Side-ways"],
          required: true,
        },
        seatNumber: {
          type: String,
          trim: true,
          required: true,
        },
        fare: {
          type: Number,
          trim: true,
          required: true,
        },
        actualPosition: {
          x: {
            type: Number,
            required: true,
          },
          y: {
            type: Number,
            required: true,
          },
        },
      },
    ],

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

    // insurance details

    insuranceName: {
      type: String,
      trim: true,
    },
    travelInsurance: {
      type: String,
      trim: true,
    },

    insuranceIssueDate: {
      type: String,
      trim: true,
    },
    insuranceExpiryDate: {
      type: String,
      trim: true,
    },

    // road tax details

    roadTaxIssueDate: {
      type: String,
      trim: true,
    },

    roadTaxExpiryDate: {
      type: String,
      trim: true,
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
