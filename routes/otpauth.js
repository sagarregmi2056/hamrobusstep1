const express = require("express");
const { generateOtpAndSignin, verifyOtpAndSignin } = require("../controllers/otpauth");
const router = express.Router();



router.post("/generateotp", generateOtpAndSignin);
router.post("/verifyotp",verifyOtpAndSignin);





module.exports = router;