var express = require("express");
var router = express.Router();

const { verifyPayment } = require("../controllers/esewa");
const { createPayment } = require("../controllers/payment");

router.post(
  "/verify-payment",
  verifyPayment,
  etbookingforpayment,
  createPayment
);

module.exports = router;
