const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', adminController.getBus);


router.post('/approve/:busId', adminController.approveBus);

router.post('/reject/:busId', adminController.rejectBus);



module.exports = router;