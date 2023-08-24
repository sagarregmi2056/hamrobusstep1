const User = require('./models/User');
const Owner = require('./models/Owner');
const Travel = require('./models/Travel')
const Location = require('./models/Travel')
const Bus = require('./models/Bus')
const Booking = require('./models/Booking')
const Guest = require("./models/Guest")



const context = {
    models: {
      User,
      Owner,
      Travel,
      Location,
      Bus,
      Booking,
      Guest,
      // ... other models ...
    },
  };
  
  module.exports = context;
  