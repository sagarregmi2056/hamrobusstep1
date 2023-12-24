const Coupon = require("../models/Discountcoupon");

exports.postcuponDiscount = async (req, res) => {
  try {
    const { code, discountPercentage, taxPercentage, expirationDate } =
      req.body;

    // Create a new instance of the Coupon model
    const newCoupon = new Coupon({
      code: code,
      discountPercentage: discountPercentage,
      taxPercentage: taxPercentage,
      expirationDate: new Date(expirationDate), // Assuming expirationDate is in a valid format
    });

    // Save the coupon to the database
    const savedCoupon = await newCoupon.save();

    console.log("Coupon created successfully:", savedCoupon);
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
