const User = require('./models/User');
const Owner = require('./models/Owner');



const context = {
    models: {
      User,
      Owner,
      // ... other models ...
    },
  };
  
  module.exports = context;
  