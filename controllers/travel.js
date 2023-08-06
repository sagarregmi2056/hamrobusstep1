const Travel = require("../models/Travel");



// lodash makes our work faster so we are using this library.
const _ = require("lodash");

exports.travelById = async (req, res, next, id) => {
  const travel = await Travel.findById(id);

  if (!travel) {
    return res.status(400).json({
      error: "Travel not found"
    });
  }
  req.travel = travel; // adds travel object in req with travel info
  next();
};

exports.add = async (req, res) => {
  const travel = new Travel(req.body);

  await travel.save();

  res.json(travel);
};

exports.getTravels = async (req, res) => {

    // here we are sorting in ascending order if we want to sort in descinding we can use -1 hai
  const travel = await Travel.find({}).sort({ name: 1 });

  res.json(travel);
};

exports.read = async (req, res) => {
  res.json(req.travel);
};

exports.update = async (req, res) => {
  let travel = req.travel;


//   Underscore.js library (or Lodash) is being used to update the travel object with the data from req.body. This is a way of merging the properties of req.body into the travel object, effectively updating the travel information.

  travel = _.extend(travel, req.body);

  await travel.save();

  res.json(travel);
};

exports.remove = async (req, res) => {
  let travel = req.travel;

  await travel.remove();

  res.json({ message: "Travel removed successfully" });
};