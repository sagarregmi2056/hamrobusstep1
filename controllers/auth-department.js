const Owner = require("../models/Owner");

exports.requiremaintenceaccount = async (req, res, next) => {
  const { id, password } = req.body; // Destructure id and password from req.body

  if (id && password) {
    try {
      // Check if there is an owner with the provided ID and password
      const foundOwner = await Owner.findOne({
        _id: id,
        password: password,
      }).select("name role");

      if (foundOwner && foundOwner.role === "maintencedep") {
        req.ownerauth = foundOwner;
        next();
      } else {
        res.status(401).json({ error: "Not authorized!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "ID and password are required" });
  }
};
