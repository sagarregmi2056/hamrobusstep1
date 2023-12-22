// MongoDB Discount Coupon Model

const mongoose = require("mongoose");

// Define the schema for the discount coupon
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the MongoDB model
const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
