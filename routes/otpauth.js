const express = require("express");
const {
  generateOtpAndSignin,
  verifyOtpAndSignin,
} = require("../controllers/otpauth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OTP Auth
 *   description: Operations related to OTP authentication
 */

/**
 * @swagger
 * /api/otpauth/generateotp:
 *   post:
 *     summary: Generate OTP
 *     description: Generates a one-time password (OTP) for user sign-in
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: phone number
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             example: { otp: 'xm56sh' }
 *       400:
 *         description: Bad request. Invalid input data.
 */

router.post("/generateotp", generateOtpAndSignin);

/**
 * @swagger
 * /api/otpauth/verifyotp:
 *   post:
 *     summary: Verify OTP and Sign In
 *     description: Verifies the provided OTP and completes the sign-in process
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: phone numver
 *               otp:
 *                 type: string
 *                 description: One-time password (OTP)
 *     responses:
 *       200:
 *         description: Sign-in successful
 *       400:
 *         description: Bad request. Invalid otp try again.
 */
router.post("/verifyotp", verifyOtpAndSignin);

module.exports = router;
