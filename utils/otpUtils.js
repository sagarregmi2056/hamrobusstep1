// otpUtils.js
const otpGenerator = require('otp-generator');

// In-memory storage for generated OTPs
const otpStorage = {};

function generateOTP(phoneNumber) {
  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

  // Store the OTP with the phone number
  otpStorage[phoneNumber] = otp;

  return otp;
}

function verifyOTP(phoneNumber, userOTP) {
  // Retrieve the stored OTP for the given phone number
  const storedOTP = otpStorage[phoneNumber];

  return storedOTP && storedOTP === userOTP;
}

module.exports = { generateOTP, verifyOTP };
