const User = require('../models/User');
const Owner = require('../models/Owner');


const resolvers = {
    Query: {
      getUser: async (_, { userId }) => {
        return await User.findById(userId);
      },
      allUsers: async (_, __, { models }) => {
        const users = await models.User.find({}, 'name');
        return users.map(user => user.name);
      },

      allOwners: async (_, __, { models }) => {
        return models.Owner.find();
      },
      owner: async (_, { id }, { models }) => {
        return models.Owner.findById(id);
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
