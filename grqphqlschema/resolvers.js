const User = require('../models/User');
const Owner = require('../models/Owner');


const resolvers = {
    Query: {
      getUser: async (_, { userId }) => {
        return await User.findById(userId);
      },
      allUsers: async (_, __, { models }) => {
        const users = await models.User.find({}, '_id name phone');
        // Convert ObjectIDs to strings
        return users.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          phone: user.phone,
        })); },

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
