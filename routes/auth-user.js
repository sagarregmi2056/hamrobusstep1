const express = require("express");

const {
  signup,
  signin,
  socialLogin,
  forgotPassword,
  resetPassword,
  userrefreshToken,
} = require("../controllers/auth-user");

const { passwordResetValidator } = require("../validator");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: Operations related to user authentication
 *
 * /api/auth-user/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 _id: 12345
 *                 name: John Doe
 *                 email: john@example.com
 *       '400':
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */
router.post("/signup", signup);

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: Operations related to user authentication
 *
 * /api/user-auth/signin:
 *   post:
 *     summary: Sign in to an existing user account
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       '200':
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *               example:
 *                 token: eyJhbGciOiJIUzI1NiIsIn...
 *       '401':
 *         description: Unauthorized, incorrect email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Incorrect email or password
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

router.post("/signin", signin);

router.post("/social-login", socialLogin);

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: Operations related to user authentication
 *
 * /api/user-auth/forgot-password:
 *   put:
 *     summary: Initiate the process for resetting a user's password
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john@example.com
 *     responses:
 *       '200':
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Password reset link sent to your email
 *       '404':
 *         description: User not found with the provided email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: User not found with the provided email
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

router.put("/forgot-password", forgotPassword);

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: Operations related to user authentication
 *
 * /reset-password:
 *   put:
 *     summary: Reset a user's password using the provided reset token
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               resetToken: your_reset_token
 *               newPassword: new_password123
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Password reset successfully
 *       '400':
 *         description: Invalid or expired reset token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid or expired reset token
 *       '404':
 *         description: User not found with the provided reset token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: User not found with the provided reset token
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/userrefreshtoken", userrefreshToken);

module.exports = router;
