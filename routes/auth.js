const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();



router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/facebook', authController.facebookAuth);
router.get('/facebook/callback', authController.facebookAuthCallback);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// router.post('/otp', authController.sendOTP);

// router.post('/otp/verify', authController.verifyOTP);

module.exports = router;