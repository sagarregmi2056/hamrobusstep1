const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Guest = require("../models/Guest");
const _ = require("lodash");

exports.bookingById = async (req, res, next, id) => {
  const booking = await Booking.findById(id).populate("bus owner guest user");

  if (!booking) {
    return res.status(400).json({
      error: "booking not found",
    });
  }
  req.booking = booking; // adds booking object in req with booking info
  next();
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find({}).populate("bus owner guest user self");

  res.json(bookings);
};

exports.getOwnerBookings = async (req, res) => {
  const bookings = await Booking.find({ owner: req.ownerauth }).populate(
    "bus owner guest user self"
  );

  res.json(bookings);
};

// exports.postBooking = async (req, res) => {
//   const booking = new Booking(req.body);
//   if (req.userauth) {
//     booking.user = req.userauth;
//   } else {
//     const name = req.body.name;
//     const email = req.body.email;
//     const phone = req.body.phone;
//     const address = req.body.address;

//     let user = await Guest.findOne({ phone });

//     if (user) {
//       user = _.extend(user, req.body);
//       await user.save();
//       booking.guest = user;
//     } else {
//       const guest = new Guest({ name, email, phone, address });
//       await guest.save();
//       booking.guest = guest;
//     }
//   }

//   const bus = await Bus.findOne({ slug: req.bus.slug });

//   if (
//     bus.seatsAvailable < (req.body.passengers || booking.passengers) ||
//     bus.isAvailable !== true ||
//     bus.soldSeat.includes(booking.seatNumber) ||
//     bus.bookedSeat.includes(booking.seatNumber)
//   ) {
//     return res.status(400).json({
//       error: "Not available"
//     });
//   }

//   bus.seatsAvailable -= req.body.passengers || booking.passengers;

//   bus.bookedSeat.push(booking.seatNumber);

//   booking.bus = bus;
//   booking.owner = bus.owner;

//   await booking.save();
//   await bus.save();

//   res.json(booking);
// };

// updated code of postbooking using ticket

function generateUniqueTicketNumber() {
  // You can customize the format of the ticket number based on your requirements
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomChars = Math.random().toString(36).substring(2, 8); // Random characters

  // Combine the timestamp and random characters to create a unique ticket number
  const uniqueNumber = `TN-${timestamp}-${randomChars}`;

  return uniqueNumber;
}

exports.postBooking = async (req, res) => {
  const booking = new Booking(req.body);
  if (req.userauth) {
    booking.user = req.userauth;
  } else {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;

    let user = await Guest.findOne({ phone });

    if (user) {
      user = _.extend(user, req.body);
      await user.save();
      booking.guest = user;
    } else {
      const guest = new Guest({ name, email, phone, address });
      await guest.save();
      booking.guest = guest;
    }
  }

  const bus = await Bus.findOne({ slug: req.bus.slug });
  if (!bus) {
    return res.status(404).json({
      error: "Bus not found",
    });
  }

  const flareThreshold = bus.fare * (req.body.seatNumber || booking.seatNumber);

  if (bus.price < flareThreshold) {
    return res.status(400).json({
      error: "Bus price is less than the flare threshold. Cannot book.",
    });
  }

  if (
    bus.seatsAvailable < (req.body.passengers || booking.passengers) ||
    bus.isAvailable !== true ||
    bus.soldSeat.includes(booking.seatNumber) ||
    bus.bookedSeat.includes(booking.seatNumber)
  ) {
    return res.status(400).json({
      error: "Not available",
    });
  }

  bus.seatsAvailable -= req.body.passengers || booking.passengers;

  bus.bookedSeat.push(booking.seatNumber);

  booking.bus = bus;
  booking.owner = bus.owner;

  // Generate a unique ticket number
  const ticketNumber = generateUniqueTicketNumber();

  // Save the ticket number to the booking schema
  booking.ticketNumber = ticketNumber;
  // booking.verification = "verified";

  await booking.save();
  await bus.save();

  // Create a ticket object from the booking data
  const ticket = {
    bookingId: booking._id, // Assuming your booking model has an _id field
    seatNumber: booking.seatNumber,
    passengers: booking.passengers,
    departureDate: booking.departureDate,
    ticketNumber: booking.ticketNumber,

    // Add more ticket details as needed
  };

  // Respond with the ticket data along with a success message
  res.status(201).json({
    message: "Booking successfully verified but not payed",
    ticket: ticket, // Include the ticket data in the response
  });
};

// exports.verifyBookingForPayment = async (req, res, next) => {
//   try {
//     const bookingId = req.body.bookingId; // Assuming you send the booking ID in the request body

//     // Find the booking by ID
//     const booking = await Booking.findById(bookingId);

//     // Check if the booking exists
//     if (!booking) {
//       return res.status(400).json({ error: "No booking found" });
//     }

//     // Update the booking status to "verified"
//     booking.verification = "verified";

//     // Save the updated booking
//     const updatedBooking = await booking.save();

//     // Set the updated booking in the request object for further processing
//     req.booking = updatedBooking;

//     next();
//   } catch (err) {
//     return res.status(400).json({ error: err?.message || "No booking found" });
//   }
// };

exports.postSold = async (req, res) => {
  // console.log("hehe")
  const booking = new Booking(req.body);
  booking.self = req.ownerauth;

  const bus = await Bus.findOne({ slug: req.bus.slug });

  if (
    bus.seatsAvailable < booking.passengers ||
    bus.isAvailable !== true ||
    bus.soldSeat.includes(booking.seatNumber) ||
    bus.bookedSeat.includes(booking.seatNumber)
  ) {
    return res.status(400).json({
      error: "Not available",
    });
  }

  bus.seatsAvailable -= booking.passengers;

  bus.soldSeat.push(booking.seatNumber);

  booking.bus = bus;
  booking.owner = bus.owner;
  booking.verification = "payed";

  await booking.save();
  await bus.save();

  res.json(booking);
};

exports.changeVerificationStatus = async (req, res) => {
  const booking = req.booking;

  booking.verification = req.body.verification;

  await booking.save();

  res.json(booking);
};

exports.deleteBooking = async (req, res) => {
  const booking = req.booking;

  const bus = await Bus.findOne({ slug: booking.bus.slug });

  if (booking.verification === "payed") {
    const removeIndexSold = bus.soldSeat
      .map((seat) => seat.toString())
      .indexOf(booking.seatNumber);

    bus.soldSeat.splice(removeIndexSold, 1);
  } else {
    const removeIndexBook = bus.bookedSeat
      .map((seat) => seat.toString())
      .indexOf(booking.seatNumber);

    bus.bookedSeat.splice(removeIndexBook, 1);
  }

  await booking.remove();
  await bus.save();

  res.json(booking);
};
