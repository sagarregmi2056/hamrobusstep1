const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Guest = require("../models/Guest");
const _ = require("lodash");
const User = require("../models/User");
const Coupon = require("../models/Discountcoupon");

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
//   if (!bus) {
//     return res.status(404).json({
//       error: "Bus not found",
//     });
//   }

//   const selectedSeatNumbers = req.body.seatNumbers || booking.seatNumbers;
// const selectedSeatsCount = selectedSeatNumbers.length;

//   // const selectedSeatsCount = (req.body.seatNumbers || booking.seatNumbers).length;

//   // const flareThreshold = bus.fare * (req.body.passengers || booking.passengers);
//   const flareThreshold = bus.fare * selectedSeatsCount;

//     if (bus.price < flareThreshold) {
//       return res.status(400).json({
//         error: "Bus price is less than the flare threshold. Cannot book.",
//       });
//     }

//     // Check if any of the selected seats are already sold or booked
// const isAnySeatSoldOrBooked = selectedSeatNumbers.some(seatNumber =>
//   bus.soldSeat.includes(seatNumber) || bus.bookedSeat.includes(seatNumber)
// );

// if (bus.seatsAvailable < selectedSeatsCount || bus.isAvailable !== true || isAnySeatSoldOrBooked) {
//   return res.status(400).json({
//     error: "One or more selected seats are not available",
//   });
// }
//   // if (
//   //   bus.seatsAvailable < selectedSeatsCount ||
//   //   bus.isAvailable !== true ||
//   //   bus.soldSeat.includes(booking.seatNumber) ||
//   //   bus.bookedSeat.includes(booking.seatNumber)
//   // ) {
//   //   return res.status(400).json({
//   //     error: "Not available",
//   //   });
//   // }

//   bus.seatsAvailable -= req.body.passengers || booking.passengers;

//   bus.bookedSeat.push(booking.seatNumber);

//   booking.bus = bus;
//   booking.owner = bus.owner;

//   // Generate a unique ticket number
//   const ticketNumber = generateUniqueTicketNumber();

//   // Save the ticket number to the booking schema
//   booking.ticketNumber = ticketNumber;
//   // booking.verification = "verified";

//   await booking.save();
//   await bus.save();

//   // Create a ticket object from the booking data
//   const ticket = {
//     bookingId: booking._id, // Assuming your booking model has an _id field
//     seatNumber: booking.seatNumber,
//     passengers: booking.passengers,
//     departureDate: booking.departureDate,
//     ticketNumber: booking.ticketNumber,

//     // Add more ticket details as needed
//   };

//   // Respond with the ticket data along with a success message
//   res.status(201).json({
//     message: "Booking successfully verified but not payed",
//     ticket: ticket, // Include the ticket data in the response
//   });
// };

exports.verifyBooking = async (req, res) => {
  try {
    const bus = await Bus.findOne({ slug: req.bus.slug });
    if (!bus) {
      return res.status(404).json({
        error: "Bus not found",
      });
    }

    const selectedSeatNumbers = req.body.seatNumbers || []; // Initialize as an empty array if not provided
    const selectedSeatsCount = selectedSeatNumbers.length;

    // Calculate flareThreshold based on the number of selected seats
    const flareThreshold = bus.fare * selectedSeatsCount;

    // Check if any of the selected seats are already sold or booked
    const isAnySeatSoldOrBooked = selectedSeatNumbers.some(
      (seatNumber) =>
        bus.soldSeat.includes(seatNumber) || bus.bookedSeat.includes(seatNumber)
    );

    // Check other conditions (seatsAvailable, isAvailable, etc.)

    if (
      bus.seatsAvailable < selectedSeatsCount ||
      bus.isAvailable !== true ||
      isAnySeatSoldOrBooked
    ) {
      return res.status(400).json({
        error: "One or more selected seats are already booked",
      });
    }

    // Create a response object with the required information
    const response = {
      flareThreshold: flareThreshold,
      busDetails: {
        busNumber: bus.busNumber,
        selectedSeatsCount: selectedSeatsCount,
        // Add other bus details as needed
      },
    };

    // Respond with the JSON object for initial verification
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// without discounts and cupon code

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

  const selectedSeatNumbers = req.body.seatNumbers || booking.seatNumbers;
  const selectedSeatsCount = selectedSeatNumbers.length;

  console.log(selectedSeatsCount);

  // Calculate flareThreshold based on the number of selected seats
  const flareThreshold = bus.fare * selectedSeatsCount;
  console.log(bus.fare);

  console.log(flareThreshold);

  console.log(booking.price);

  console.log("Sold Seats:", bus.soldSeat);
  console.log("Booked Seats:", bus.bookedSeat);
  // Check if any of the selected seats are already sold or booked
  const isAnySeatSoldOrBooked = selectedSeatNumbers.some(
    (seatNumber) =>
      bus.soldSeat.includes(seatNumber) || bus.bookedSeat.includes(seatNumber)
  );

  // console.log("isAnySeatSoldOrBooked:", isAnySeatSoldOrBooked);
  console.log("Bus Availability:", bus.isAvailable);
  console.log("Available Seats:", bus.seatsAvailable);
  console.log("Selected Seats Count:", selectedSeatsCount);

  if (
    bus.seatsAvailable < selectedSeatsCount ||
    bus.isAvailable !== true ||
    isAnySeatSoldOrBooked
  ) {
    return res.status(400).json({
      error: "One or more selected seats are not available",
    });
  }

  // Deduct seatsAvailable and update bookedSeat for each selected seat
  selectedSeatNumbers.forEach((seatNumber) => {
    bus.seatsAvailable -= 1;
    bus.bookedSeat.push(seatNumber);
  });

  booking.bus = bus;
  booking.owner = bus.owner;
  booking.verification = "notverified";

  // Generate a unique ticket number
  const ticketNumber = generateUniqueTicketNumber();

  // Save the ticket number to the booking schema
  booking.ticketNumber = ticketNumber;

  await booking.save();
  await bus.save();
  // Fetch user names
  let userName = "";
  if (booking.user) {
    const user = await User.findById(booking.user);
    userName = user ? user.name : "";
  } else if (booking.guest) {
    userName = booking.guest.name;
  }
  // Create a ticket object from the booking data
  const preTicketDetails = {
    bookingId: booking._id,
    seatNumbers: selectedSeatNumbers,
    passengers: booking.passengers,
    departureDate: booking.departureDate,
    ticketNumber: booking.ticketNumber,
    userName: userName,
    flareThreshold: flareThreshold,
  };

  // Respond with the ticket data along with a success message
  res.status(201).json({
    message: `Booking successfully verified but not paid,Total amount is ${flareThreshold}`,
    preticketDetails: preTicketDetails,
  });
};

// booking function afer discount cupon

exports.postBookingwithdiscount = async (req, res) => {
  const booking = new Booking(req.body);

  const couponCode = req.body.couponCode;
  let taxAmount = 0;

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

  const selectedSeatNumbers = req.body.seatNumbers || booking.seatNumbers;
  const selectedSeatsCount = selectedSeatNumbers.length;

  console.log(selectedSeatsCount);

  // Calculate flareThreshold based on the number of selected seats
  let flareThreshold = bus.fare * selectedSeatsCount;
  console.log(bus.fare);

  console.log(flareThreshold);

  console.log(booking.price);

  console.log("Sold Seats:", bus.soldSeat);
  console.log("Booked Seats:", bus.bookedSeat);
  // Check if any of the selected seats are already sold or booked
  const isAnySeatSoldOrBooked = selectedSeatNumbers.some(
    (seatNumber) =>
      bus.soldSeat.includes(seatNumber) || bus.bookedSeat.includes(seatNumber)
  );

  // console.log("isAnySeatSoldOrBooked:", isAnySeatSoldOrBooked);
  console.log("Bus Availability:", bus.isAvailable);
  console.log("Available Seats:", bus.seatsAvailable);
  console.log("Selected Seats Count:", selectedSeatsCount);

  if (
    bus.seatsAvailable < selectedSeatsCount ||
    bus.isAvailable !== true ||
    isAnySeatSoldOrBooked
  ) {
    return res.status(400).json({
      error: "One or more selected seats are not available",
    });
  }

  // Check if a valid coupon code is provided
  if (couponCode) {
    try {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (coupon) {
        // Calculate the discount based on the coupon percentage
        const discountAmount =
          (coupon.discountPercentage / 100) * flareThreshold;

        // Deduct the discount from the flareThreshold
        flareThreshold -= discountAmount;

        // Calculate the tax based on the tax percentage from the Coupon model
        taxAmount = (coupon.taxPercentage / 100) * flareThreshold;

        console.log("Discount Applied:", discountAmount);
        console.log("Tax Applied:", taxAmount);
      } else {
        // Respond with an error if the coupon code is not valid
        return res.status(400).json({
          error: "Invalid coupon code",
        });
      }
    } catch (error) {
      console.error("Error fetching coupon:", error.message);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  } else {
    // If no coupon code provided, calculate tax based on your logic
    // For now, let's assume a fixed tax percentage of 5%
    const fixedTaxPercentage = 13;
    taxAmount = (fixedTaxPercentage / 100) * flareThreshold;
    console.log("Tax Applied:", taxAmount);
  }

  // Deduct seatsAvailable and update bookedSeat for each selected seat
  selectedSeatNumbers.forEach((seatNumber) => {
    bus.seatsAvailable -= 1;
    bus.bookedSeat.push(seatNumber);
  });

  booking.bus = bus;
  booking.owner = bus.owner;
  booking.verification = "notverified";

  // Generate a unique ticket number
  const ticketNumber = generateUniqueTicketNumber();

  // Save the ticket number to the booking schema
  booking.ticketNumber = ticketNumber;

  await booking.save();
  await bus.save();
  // Fetch user names
  let userName = "";
  if (booking.user) {
    const user = await User.findById(booking.user);
    userName = user ? user.name : "";
  } else if (booking.guest) {
    userName = booking.guest.name;
  }
  // Create a ticket object from the booking data
  const preTicketDetails = {
    bookingId: booking._id,
    seatNumbers: selectedSeatNumbers,
    passengers: booking.passengers,
    departureDate: booking.departureDate,
    ticketNumber: booking.ticketNumber,
    userName: userName,
    flareThreshold: flareThreshold,
  };

  // Respond with the adjusted threshold amount along with a success message
  res.status(201).json({
    message: `Booking successfully verified but not paid, Total amount is ${
      flareThreshold + taxAmount
    }`,
    preticketDetails: preTicketDetails,
  });
};

exports.getbookingforpayment = async (req, res, next) => {
  try {
    const ticketNumber = req.body.ticketNumber; // Assuming ticketNumber is sent in the request body

    const booking = await Booking.findOne({ ticketNumber });

    if (!booking) {
      return res
        .status(400)
        .json({ error: "No booking found with the provided ticketNumber" });
    }

    // Assuming verification is initially set to "notverified"
    booking.verification = "verified";

    // Set other fields or perform additional actions as needed

    const updatedBooking = await booking.save();
    req.booking = updatedBooking;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: err?.message || "Error verifying booking" });
  }
};

exports.getmyBookings = async (req, res) => {
  try {
    // Assuming user information is available in req.userauth after authentication
    const userId = req.userauth._id;

    // Retrieve bookings for the authenticated user
    const userBookings = await Booking.find({ user: userId });

    // Send the user's bookings in the response
    res.json({ userBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.userauth._id; // Assuming user information is available in req.userauth after authentication

    // Check if the booking belongs to the authenticated user
    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking details
    booking.passengers = req.body.passengers; // Update with the fields you want to allow users to modify
    // Add more fields as needed

    // Save changes to the database
    await booking.save();

    res.json({
      message: "Booking updated successfully",
      updatedBooking: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
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

// exports.postSold = async (req, res) => {
//   // console.log("hehe")
//   const booking = new Booking(req.body);
//   booking.self = req.ownerauth;

//   const bus = await Bus.findOne({ slug: req.bus.slug });

//   if (
//     bus.seatsAvailable < booking.passengers ||
//     bus.isAvailable !== true ||
//     bus.soldSeat.includes(booking.seatNumber) ||
//     bus.bookedSeat.includes(booking.seatNumber)
//   ) {
//     return res.status(400).json({
//       error: "Not available",
//     });
//   }

//   bus.seatsAvailable -= booking.passengers;

//   bus.soldSeat.push(booking.seatNumber);

//   booking.bus = bus;
//   booking.owner = bus.owner;
//   booking.verification = "payed";

//   await booking.save();
//   await bus.save();

//   res.json(booking);
// };

// exports.postSold = async (req, res) => {
//   try {
//     const booking = new Booking(req.body);
//     booking.self = req.ownerauth;

//     const bus = await Bus.findOne({ slug: req.bus.slug });

//     // Assuming seatNumbers is an array, check if any of the selected seats are not available for selling
//     if (
//       bus.seatsAvailable < booking.passengers ||
//       bus.isAvailable !== true ||
//       booking.seatNumbers.some(
//         (seatNumber) =>
//           bus.soldSeat.includes(seatNumber) ||
//           bus.bookedSeat.includes(seatNumber)
//       )
//     ) {
//       return res.status(400).json({
//         error: "One or more selected seats are not available for selling",
//       });
//     }

//     // Update bus information after selling seats
//     bus.seatsAvailable -= booking.passengers;

//     // Assuming seatNumbers is an array, update soldSeat for each selected seat
//     booking.seatNumbers.forEach((seatNumber) => {
//       bus.soldSeat.push(seatNumber);
//     });

//     // Update booking information to mark it as "payed"
//     booking.bus = bus;
//     booking.owner = bus.owner;
//     booking.verification = "payed";

//     // Save changes to the database
//     await booking.save();
//     await bus.save();

//     res.json({
//       message: "Seats successfully marked as sold after payment",
//       booking: booking,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };

exports.postSold = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    booking.self = req.ownerauth;

    const bus = await Bus.findOne({ slug: req.bus.slug });

    // Count the number of selected seats
    const selectedSeatsCount = booking.seatNumbers.length;

    // Assuming seatNumbers is an array, check if any of the selected seats are not available for selling
    if (
      bus.seatsAvailable < selectedSeatsCount ||
      bus.isAvailable !== true ||
      booking.seatNumbers.some(
        (seatNumber) =>
          bus.soldSeat.includes(seatNumber) ||
          bus.bookedSeat.includes(seatNumber)
      )
    ) {
      return res.status(400).json({
        error: "One or more selected seats are not available for selling",
      });
    }

    // Update bus information after selling seats
    bus.seatsAvailable -= selectedSeatsCount;

    // Assuming seatNumbers is an array, update soldSeat for each selected seat
    booking.seatNumbers.forEach((seatNumber) => {
      bus.soldSeat.push(seatNumber);
    });

    // Update booking information to mark it as "payed"
    booking.bus = bus;
    booking.owner = bus.owner;
    booking.verification = "verified";

    // Save changes to the database
    await booking.save();
    await bus.save();

    res.json({
      message: "Seats successfully marked as sold after payment",
      booking: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
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
