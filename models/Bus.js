const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  busNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  panCardImage: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  numberOfBuses: {
    type: Number,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  originAddress: {
    type: String,
    required: true
  },
  destinationAddress: {
    type: String,
    required: true
  },

  date: {
    type: Date, // Assuming you store dates as Date type
    required: true
  },

  busType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    default: 'Non-AC'
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Bus', busSchema);