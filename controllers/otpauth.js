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

// *************in case of sms provider we will be using like this just it is different that we are sending json directly********

//   try {
//     await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       to: `+${phone}`, // Ensure phone numbers are in E.164 format, for example, +14155238886
//       from: twilioPhoneNumber,
//     });

//     res.json({ success: true, message: 'OTP sent successfully.' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: 'Error sending OTP.' });
//   }
// };



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
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6M' });
  
    return res.json({ token });
  };



  exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      req.owner = decoded; // Attach the decoded token payload to the request object
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
// using firebase once  for testing i have commented the whole code 
