const FormData = require("form-data");
const fetch = require("node-fetch");

exports.verifyPayment = async (req, res, next) => {
  try {
    const { amt, refId, bookingId } = req.body;

    // console.log(req.body.bookingId); // Change oid to bookingId if you are using Booking ID
    // var form = new FormData();
    // form.append("amt", amt);
    // form.append("rid", refId);
    // form.append("pid", bookingId); // Use bookingId for payment verification
    // form.append("scd", process.env.ESEWA_MERCHANT_CODE);

    const requestBody = {
      amt,
      rid: refId,
      pid: bookingId, // Use bookingId for payment verification
      scd: process.env.ESEWA_MERCHANT_CODE,
    };
    console.log(requestBody);
    const response = await fetch(process.env.ESEWA_URL + "/epay/transrec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Corrected placement
      },
      body: JSON.stringify(requestBody),
    });
    // console.log(response);
    // const body = await response.text();
    const responseBody = await response.text();

    console.log(responseBody);
    // console.log(JSON.stringify(requestBody));

    if (responseBody.includes("Success")) {
      next();
    } else {
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
