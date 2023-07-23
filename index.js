const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const busController = require('./controllers/busController');
const Bus = require('./models/Bus');
const User = require('./models/User')
const { ObjectId } = require('mongoose');
require('dotenv').config();



// i need to place all this on .env file









  const app = express();


  app.use(
    session({
      // SameSite:none,
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
  
    })
  );
  
  
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


  // Serve static files from the "public" directory
app.use(express.static('public'));

// multer use gaedai xam middleware ko rup ma 

const multer = require('multer');

// Set up a storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory where uploaded files will be stored
    cb(null, 'uploads'); // 'uploads' is the directory where files will be saved
  },
  filename: function (req, file, cb) {
    // Define the filename of the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create a multer instance with the defined storage engine
const upload = multer({ storage: storage });

// Use the multer middleware for handling file uploads
app.use(upload.single('panCardImage'));


























// importing all of the route
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/bus');
const adminRoutes = require('./routes/admin');

// Configure Express app



app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'HAMROBUSAUTH',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testhamrobus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('wow finally database suru vayo hai hamrobus ko');
}).catch((err) => {
  console.error('Error from index.js file of server connecting to MongoDB:', err);
});

// Set up routes
app.get('/', (req, res) => {
    // Replace this with the logic to render your home page or redirect to a specific route
    // For example: res.render('home') or res.redirect('/home')
   console.log("welcome to hamrobus my mate");
  });

app.use('/auth', authRoutes);
app.use('/bus', busRoutes);
app.use('/admin', adminRoutes);

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});