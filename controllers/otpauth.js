const { generateOTP, verifyOTP } = require('../utils/otpUtils');
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner')

// require("dotenv").config();




exports.generateOtpAndSignin = async (req, res) => {
  const { phone } = req.body;


if (!isValidPhoneNumber(phone)) {
  return res.status(400).json({
    error: "Invalid Nepali phone number format.",
  });
}

  // Generate and send OTP to the owner's phone number
  const otp = generateOTP(phone);

// *************in case of sms provider we will be using like this just it is different that we are sending json directly********




  res.json({ otp });
};




function isValidPhoneNumber(phone) {
  // Use a regular expression to check for a valid phone number format
  const phoneRegex =  /^\+977\s*[1-9]\d\s?\d{8}$/;

  return phoneRegex.test(phone);
}
// exp


exports.verifyOtpAndSignin = async (req, res) => {
    const { phone, otp } = req.body;
  
    // Skip checking the phone number in the database
    const owner = new Owner({phone});


    // Verify OTP
    if (!verifyOTP(phone,otp)) {
      return res.status(401).json({
        error: "Incorrect OTP"
      });
    }


    try {
      await owner.save();
  } catch (error) {
      console.error("Error saving owner's phone number:", error);
      return res.status(500).json({
          error: "Internal Server Error"
      });
  }

  
    // OTP verification successful, generate JWT token
    const payload = {
      phone: phone,
      otp:otp // Include the phone number directly in the payload
    };
  
    // In a real-world scenario, you might want to save the phone number to the database here

  
    const token = jwt.sign(payload, process.env.JWT_SECRET, {  expiresIn: '6h' });

  
    return res.json({token});
  };








  exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
  
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(" ")[1];
  
    //Checking if the token is null
    if (!token) {
      return res.status(401).send("Authorization failed. No access token.");
    }
  
    //Verifying if the token is valid.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Could not verify token");
      }
      // req.user = user;
    });
    next();
  };
 

  

// function parseToken(token) {
//   try {
//     return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//   } catch (err) {
//     return false;
//   }
// }
