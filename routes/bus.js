const express = require('express');
const busController = require('../controllers/busController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/submit', busController.submitBus);

// Bus owner's dashboard
router.get('/dashboard', (req, res) => {
  // Logic to retrieve all buses owned by the authenticated user
  // You can query the database to find buses owned by the current user
  // Assuming the user is authenticated, you can get the user ID from req.user._id
   
  // Replace the following lines with your logic to fetch the buses owned by the user
  const busesOwnedByUser = []; // Retrieve buses owned by the user from the database

  res.send( { buses: busesOwnedByUser });
});
router.get('/add', (req, res) => {
  res.sendFile('add_bus.html', { root: __dirname + '/../public' });
});
// routes to submit bus only for admin and bus owner

// homepage
router.get('/', busController.homePage);
// searching
router.post('/search', busController.searchBuses);


router.post('/submit-ticket', busController.submitTicket);
// Route to handle ticket booking
router.post('/book-ticket/:ticketId', busController.bookTicket);
// 


module.exports = router;