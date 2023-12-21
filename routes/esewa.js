var express = require("express");
var router = express.Router();

const { verifyPayment } = require("../controllers/esewa");
const { createPayment } = require("../controllers/payment");
const { getbookingforpayment } = require("../controllers/booking");

router.post(
  "/verify-payment",
  verifyPayment,
  getbookingforpayment,
  createPayment
);

module.exports = router;
