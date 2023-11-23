const { generateOTP, verifyOTP } = require('../utils/otpUtils');
const jwt = require('jsonwebtoken');

// require("dotenv").config();




exports.generateOtpAndSignin = async (req, res) => {
  const { phone } = req.body;
//   const owner = await Owner.findOne({ phone });

//   if (!owner) {
//     return res.status(401).json({
//       error: "Owner with that phone number does not exist."
//     });
//   }


if (!isValidPhoneNumber(phone)) {
  return res.status(400).json({
    error: "Invalid Nepali phone number format.",
  });
}

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




function isValidPhoneNumber(phone) {
  // Use a regular expression to check for a valid phone number format
  const phoneRegex =  /^\+977\s*[1-9]\d\s?\d{8}$/;

  return phoneRegex.test(phone);
}
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
    const { phone, otp } = req.body;
  
    // Skip checking the phone number in the database
  
    // Verify OTP
    if (!verifyOTP(phone,otp)) {
      return res.status(401).json({
        error: "Incorrect OTP"
      });
    }
  
    // OTP verification successful, generate JWT token
    const payload = {
      phone: phone,
      otp:otp // Include the phone number directly in the payload
    };
  
    // In a real-world scenario, you might want to save the phone number to the database here
  
    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6M' });

  
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
 

  // exports.verifyToken = (req, res, next) => {
  // //  const tokenofuser = req.headers.authorization;
  // const token = req.headers.authorization;
  // if (token) {

  //   const owner = parseToken(token);
  //   next();

  // }
  
  // else{
  //   res.status(401).json({ error: "Not authorized" });
  // }


  //   //     const owner = parseToken(token);
    
  // };
// using firebase once  for testing i have commented the whole code 

// exports.verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization;

  

//   if (token) {
//     const owner = parseToken(token);
//     // console.log("hehe")

//     const foundowner = await Owner.findById(owner._id).select("name role salt hashed_password");

//     // console.log("hehe")

//     if (foundowner && foundowner.role === "owner") {
//       // console.log("hehe")
//       req.ownerauth = foundowner;
//       next();
//     } else res.status(401).json({ error: "Not authorized!" });
//   } else {
//     res.status(401).json({ error: "Not authorized" });
//   }
// };

function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
}
