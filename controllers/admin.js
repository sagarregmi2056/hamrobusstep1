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
  
      // Checking if the user making the request is a super admin
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



//   function to approve owner 

  exports.approveOwner = async (req, res) => {
    try {
      const ownerId = req.params.ownerId;
  
      // Find the owner by ID
      const owner = await Owner.findById(ownerId);
  
      if (!owner) {
        return res.status(404).json({ error: "Owner not found" });
      }
  
      // Update the owner's status to "approved"
      owner.status = "approved";
  
      // Save the updated owner document
      await owner.save();
  
      res.json({ message: "Owner approved successfully", owner });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


//   // Controller function to reject an owner without reason
// exports.rejectOwner = async (req, res) => {
//     try {
//       const ownerId = req.params.ownerId;
  
//       // Find the owner by ID
//       const owner = await Owner.findById(ownerId);
  
//       if (!owner) {
//         return res.status(404).json({ error: "Owner not found" });
//       }
  
//       // Update the owner's status to "rejected"
//       owner.status = "rejected";
  
//       // Save the updated owner document
//       await owner.save();
  
//       res.json({ message: "Owner rejected successfully", owner });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };


//   to reject them with a reason 

  exports.rejectOwner = async (req, res) => {
    try {
      const ownerId = req.params.ownerId;
      const { rejectionReason } = req.body; // Extraction of the rejection reason from the request body
  
      // Find the owner by ID
      const owner = await Owner.findById(ownerId);
  
      if (!owner) {
        return res.status(404).json({ error: "Owner not found" });
      }
  
      // Update the owner's status to "rejected" and save the rejection reason
      owner.status = "rejected";
      owner.rejectionReason = rejectionReason;
  
      // Save the updated owner document
      await owner.save();
  
      res.json({ message: "Owner rejected successfully",reason: rejectionReason , owner });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };