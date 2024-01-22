const { generateOTP, verifyOTP } = require("../utils/otpUtils");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

exports.generateOtpAndSignin = async (req, res) => {
  const { phone } = req.body;

  if (!isValidPhoneNumber(phone)) {
    return res.status(400).json({
      error: "Invalid Nepali phone number format.",
    });
  }

  const otp = generateOTP(phone);

  // *************in case of sms provider we will be using like this just it is different that we are sending json directly********

  res.json({ otp });
};

function isValidPhoneNumber(phone) {
  // Use a regular expression to check for a valid phone number format
  const phoneRegex = /^\+977\s*[1-9]\d\s?\d{8}$/;

  return phoneRegex.test(phone);
}

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed. No access token.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send("Could not verify token");
    }
  });
  next();
};

exports.verifyOtpAndSignin = async (req, res) => {
  const { phone, otp } = req.body;

  let owner = await Owner.findOne({ phone });

  console.log(owner);

  if (owner) {
    if (!verifyOTP(phone, otp)) {
      return res.status(401).json({
        error: "Incorrect OTP",
      });
    }
  } else {
    // Owner doesn't exist, create a new owner
    owner = new Owner({ phone });

    try {
      await owner.save();
    } catch (error) {
      console.error("Error saving owner's phone number:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }

    // Verify OTP for the newly created owner
    if (!verifyOTP(phone, otp)) {
      return res.status(401).json({
        error: "Incorrect OTP",
      });
    }
  }

  // OTP verification successful or owner already existed, generate JWT token
  const payload = {
    _id: owner.id,
    phone: phone,
    role: owner.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  const ownerId = owner._id;

  return res.json({ ownerId, token, owner });
};
