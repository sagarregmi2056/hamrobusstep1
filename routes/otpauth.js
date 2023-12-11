const express = require("express");
const {
  generateOtpAndSignin,
  verifyOtpAndSignin,
} = require("../controllers/otpauth");
const router = express.Router();

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
 *     description: |
 *       Verifies the provided OTP and completes the sign-in process. If the owner
 *       with the given phone number doesn't exist, a new owner will be created.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               otp:
 *                 type: string
 *                 description: One-time password (OTP)
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               token: 'your_jwt_token'
 *               owner:
 *                 _id: '1234567890'
 *                 phone: 'user_phone_number'
 *                 role: 'user_role'
 *       401:
 *         description: Incorrect OTP or other authentication failure
 *         content:
 *           application/json:
 *             example:
 *               error: 'Incorrect OTP'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */
router.post("/verifyotp", verifyOtpAndSignin);

module.exports = router;
