const User = require('../models/User');

const resolvers = {
    Query: {
      getUser: async (_, { userId }) => {
        return await User.findById(userId);
      },
      allUsers: async (_, __, { models }) => {
        const users = await models.User.find({}, 'name');
        return users.map(user => user.name);
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
