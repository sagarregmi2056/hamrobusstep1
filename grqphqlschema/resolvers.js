const User = require('../models/User');

const resolvers = {
    Query: {
      getUser: async (_, { userId }) => {
        return await User.findById(userId);
      },
    },
    Mutation: {
      createUser: async (_, { userInput }) => {
        const newUser = new User(userInput);
        return await newUser.save();
      },
    },
  };
  module.exports = resolvers;  
