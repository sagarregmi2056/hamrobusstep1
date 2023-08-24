const User = require('../models/User');
const Owner = require('../models/Owner');
const Location = require('../models/Location'); 


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
      allTravels: async (_, __, { models }) => {
        return models.Travel.find();
      },
      travel: async (_, { id }, { models }) => {
        return models.Travel.findById(id);
      },
      
      allLocations: async () => {
        try {
          const locations = await Location.find(); // Fetch all locations from the database
          return locations.map(location => ({
            name: location.name,
            district: location.district
          }));
        } catch (error) {
          throw new Error("Error fetching locations");
        }
      },
    
     

    location: async (_, { id }) => {
      try {
        const location = await Location.findById(id);
        if (!location) {
          throw new Error(`Location with ID ${id} not found`);
        }
        return {
          name: location.name,
          district: location.district
        };
      } catch (error) {
        throw new Error(`Error fetching location with ID ${id}`);
      }
    }
  },

    Mutation: {
      createUser: async (_, { userInput }) => {
        const newUser = new User(userInput);
        return await newUser.save();
      },
    },
  };
  module.exports = resolvers;  
