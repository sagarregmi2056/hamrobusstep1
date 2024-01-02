const Query = require("../models/Query");
const Bus = require("../models/Bus");
// const User = require('../models/User');

exports.busBySlug = async (req, res, next, slug) => {
  const bus = await Bus.findOne({ slug }).populate("owner", "name role");
  if (!bus) {
    return res.status(400).json({ error: "Bus not found " });
  }

  req.bus = bus;
  next();
};

exports.postQueryUserToBus = async (req, res) => {
  try {
    const { content } = req.body;

    const userId = req.userauth._id;

    // Validate required fields
    if (!userId || !content) {
      console.log(userId);
      return res.status(400).json({ error: "Missing required fields " });
    }

    // Check if the owner exists
    // const bus = await Bus.findById({ slug: req.bus.slug });
    const bus = await Bus.findOne({ slug: req.bus.slug });

    if (!bus) {
      return res.status(404).json({ error: "bus not found" });
    }
    Query.bus = bus;
    // Create a new query
    const newQuery = new Query({
      userId,
      bus: bus,
      content,
    });

    // Save the query to the database
    const savedQuery = await newQuery.save();

    // Update the owner's queries array with the new query reference
    // bus.queries.push(savedQuery._id);
    // await owner.save();

    res
      .status(201)
      .json({ message: "Query submitted successfully", query: savedQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getQueriesForBus = async (req, res) => {
  try {
    const bus = await Bus.findOne({ slug: req.bus.slug });
    // Assuming req.bus is populated by the busBySlug middleware
    //   const busId = req.bus._id;

    // Retrieve queries for the specified bus
    const queries = await Query.find({ bus: bus })
      .select("userId bus content")
      .populate({ path: "bus", select: "slug" })
      .populate("content", "userId");

    res.status(200).json({ queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
