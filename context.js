const User = require("./models/User");
const Owner = require("./models/Owner");

const Bus = require("./models/Bus");
const Booking = require("./models/Booking");
const Guest = require("./models/Guest");

const context = {
  models: {
    User,
    Owner,
    Bus,
    Booking,
    Guest,

    // ... other models ...
  },
};

module.exports = context;
