const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Facebook authentication
exports.facebookAuth = passport.authenticate('facebook', { scope: ['email'] });

exports.facebookAuthCallback = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
});

// Google authentication
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
});

// // OTP authentication
// exports.sendOTP = (req, res) => {
//   send otp
// };

// exports.verifyOTP = (req, res) => {
//   // Logic to verify 
// };

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      userType
    });
    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// User login
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'An error occurred during login' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'An error occurred during login' });
      }
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
};

// User logout
exports.logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful' });
};




// Function to check if the user is authorized as an admin
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'ADMIN') {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Function to check if the user is authorized as a bus owner
exports.isBusOwner = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'BUS_OWNER') {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Function to check if the user is logged in
exports.isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is logged in, proceed to the next middleware or route
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
};