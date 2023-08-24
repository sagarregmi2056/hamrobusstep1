const User = require('./models/User');
const Owner = require('./models/Owner');
const Travel = require('./models/Travel')
const Location = require('./models/Travel')



const context = {
    models: {
      User,
      Owner,
      Travel,
      Location,
      // ... other models ...
    },
  };
  
  module.exports = context;
  