const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    citizenshipNumber: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    phone: {
      type: Number,
      max: 9999999999,
      required: true,
    },
    isVerified: {
      default: false,
    },
    email: {
      type: String,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    salt: String,
    role: {
      type: String,
      enum: ["owner", "superadmin"],
      default: "owner",
    },
  },
  { timestamps: true }
);
