const User = require("../models/User");
const Owner = require("../models/Owner");
const Location = require("../models/Location");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Guest = require("../models/Guest");

const resolvers = {
  Query: {
    getUser: async (_, { userId }) => {
      return await User.findById(userId);
    },
    allUsers: async (_, __, { models }) => {
      const users = await models.User.find({}, "_id name phone");
      // Convert ObjectIDs to strings
      return users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        phone: user.phone,
      }));
    },

    // allOwners: async (_, __, { models }) => {
    //   return models.Owner.find();
    // },

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
        return locations.map((location) => ({
          name: location.name,
          district: location.district,
        }));
      } catch (error) {
        throw new Error("Error fetching locations");
      }
    },
    busesByType: async (_, args) => {
      try {
        const buses = await Bus.find({ type: args.type });
        return buses;
      } catch (err) {
        throw new Error("Error fetching buses by type");
      }
    },

    allOwnerDetails: async (_, __, { models }) => {
      try {
        const owners = await models.Owner.find({}, "_id name email");
        return owners.map((owner) => ({
          id: owner._id.toString(),
          name: owner.name || null,
          email: owner.email || null,
        }));
      } catch (err) {
        throw new Error("Error fetching owner details");
      }
    },

    getBusDetails: async (_, { busId }, { models }) => {
      try {
        const bus = await models.Bus.findById(busId)
          .select("name fare busNumber images")
          .populate("images", "type url");

        if (!bus) {
          throw new Error("Bus not found");
        }

        return {
          id: bus._id.toString(),
          name: bus.name,
          fare: bus.fare,
          busNumber: bus.busNumber,
          images: bus.images,
        };
      } catch (err) {
        throw new Error(`Error fetching bus details: ${err.message}`);
      }
    },
    bookingByTicketNumber: async (_, { ticketNumber }, { models }) => {
      try {
        const booking = await models.Booking.findOne({ ticketNumber })
          .populate("user") // Make sure to populate other fields as needed
          .populate({
            path: "bus",
            populate: {
              path: "owner", // Populate owner details if needed
              model: "Owner",
            },
          });

        if (!booking) {
          throw new Error("Booking not found");
        }

        return booking; // Make sure this includes the 'seatNumber' field
      } catch (error) {
        console.error(
          `Error fetching booking by ticket number: ${error.message}`
        );
        throw new Error("Internal server error");
      }
    },

    bookingsByVerification: async (_, { verification }, { models }) => {
      try {
        const bookings = await models.Booking.find({ verification })
          .populate({
            path: "guest",
            select: "name",
          })
          .populate({
            path: "user",
            select: "name",
          })
          .populate({
            path: "bus",
            select: "name",
            populate: {
              path: "owner",
              select: "name",
            },
          });

        return bookings;
      } catch (err) {
        throw new Error("Error fetching bookings by verification");
      }
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
