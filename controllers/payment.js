const Booking = require("../models/Booking");
const Payment = require("../models/payment");

exports.createPayment = async (req, res) => {
  try {
    const { amt, refId, bookingId } = req.body; // Adjust the fields based on your requirements

    // Assuming you have a Booking model
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const flareThreshold = booking.bus.fare * booking.seatNumbers.length;

    // Check if the payment amount matches the expected flareThreshold
    if (parseFloat(amt) !== flareThreshold) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    // Create a payment record
    const payment = new Payment({
      user: booking.user, // Assuming user information is available in the booking
      source_payment_id: refId,
      amount: amt,
      booking: booking._id,
      // Add other fields as needed
    });

    const createdPayment = await payment.save();

    // Update booking status or perform other actions if needed
    booking.verification = "payed";
    await booking.save();

    res.json({
      message: "Payment Created Successfully",
      payment: createdPayment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ error: err?.message || "Error creating payment" });
  }
};
