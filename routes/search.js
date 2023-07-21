// routes/search.js
const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Search route
router.get('/', busController.searchBuses);

module.exports = router;
