const { generateOTP, verifyOTP } = require('../utils/otpUtils');
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner'); // Assuming your Owner model is in a separate file

exports.generateOtpAndSignin = async (req, res) => {
  const { phone } = req.body;
//   const owner = await Owner.findOne({ phone });

//   if (!owner) {
//     return res.status(401).json({
//       error: "Owner with that phone number does not exist."
//     });
//   }

  // Generate and send OTP to the owner's phone number
  const otp = generateOTP(phone);

  // In a real-world scenario, you would send this OTP to the user via SMS or other means
  // For simplicity, we'll just send it in the response for demonstration purposes
  res.json({ otp });
};

// exports.verifyOtpAndSignin = async (req, res) => {
//   const { phone, userOTP } = req.body;
//   const owner = await Owner.findOne({ phone });

//   if (!owner) {
//     return res.status(401).json({
//       error: "Owner with that phone number does not exist."
//     });
//   }

//   // Verify OTP
//   if (!verifyOTP(phone, userOTP)) {
//     return res.status(401).json({
//       error: "Incorrect OTP"
//     });
//   }

//   // OTP verification successful, generate JWT token
//   const payload = {
//     phone: owner.phone // Only include the phone number in the payload
//   };

//   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

//   return res.json({ token });
// };
exports.verifyOtpAndSignin = async (req, res) => {
    const { phone, userOTP } = req.body;
  
    // Skip checking the phone number in the database
  
    // Verify OTP
    if (!verifyOTP(phone, userOTP)) {
      return res.status(401).json({
        error: "Incorrect OTP"
      });
    }
  
    // OTP verification successful, generate JWT token
    const payload = {
      phone: phone // Include the phone number directly in the payload
    };
  
    // In a real-world scenario, you might want to save the phone number to the database here
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  
    return res.json({ token });
  };