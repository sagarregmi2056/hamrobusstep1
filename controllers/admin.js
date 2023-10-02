// superadmin-controller.js

const Owner = require("../models/Owner");

exports.getAllAdminOwners = async (req, res) => {
  try {
    const owners = await Owner.find().select("-hashed_password -salt"); // Exclude sensitive fields
    res.json(owners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add more controller actions as needed for super admin tasks


// 
exports.updateOwnerStatus = async (req, res) => {
    try {
      const { ownerId, status } = req.body;
  
      // Check if the user making the request is a super admin
      if (req.ownerauth.role !== "superadmin") {
        return res.status(403).json({ error: "Permission denied" });
      }
  
      // Find the owner by ID and update the status
      const owner = await Owner.findByIdAndUpdate(
        ownerId,
        { status },
        { new: true }
      );
  
      if (!owner) {
        return res.status(404).json({ error: "Owner not found" });
      }
  
      res.json({ message: "Owner status updated successfully", owner });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };