// superadmin-controller.js

const Owner = require("../models/Owner");

exports.getOwnerDetails = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    console.log("Received ownerId:", ownerId);

    // Retrieve owner details
    const ownerDetails = await Owner.findById(ownerId);

    if (!ownerDetails) {
      return res.status(404).json({
        error: "Owner not found",
      });
    }

    // Return owner details, including vendorDetail and status
    res.json({
      ownerId: ownerDetails._id,
      travelName: ownerDetails.travelName,
      pincode: ownerDetails.pincode,
      state: ownerDetails.state,
      city: ownerDetails.city,
      phone: ownerDetails.phone,
      email: ownerDetails.email,
      name: ownerDetails.name,
      country: ownerDetails.country,
      district: ownerDetails.district,
      vendorDetail: ownerDetails.vendorDetail,
      status: ownerDetails.status,
      panNumber: ownerDetails.panNumber,
      panName: ownerDetails.panName,

      // Assuming 'status' is a property of the Owner model
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving owner details" });
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
    let { rejectionReason } = req.body;

    // Find the owner by ID
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Update the owner's status to "rejected" and save the rejection reason
    owner.status = "rejected";

    // Check if rejectionReason is provided, otherwise set it to an empty string
    owner.rejectionReason =
      rejectionReason !== undefined ? rejectionReason : "";

    // Save the updated owner document
    await owner.save();

    res.json({
      message: "Owner rejected successfully",
      reason: owner.rejectionReason, // Use the actual stored rejection reason
      owner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    // Retrieve all owners' documents
    const allDocuments = await Owner.find(
      { role: "owner" },
      "_id images phone"
    );

    // Return the list of documents
    res.json(allDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving owners' documents" });
  }
};

exports.getPendingSuccessDocuments = async (req, res) => {
  try {
    // Retrieve all owners' documents with vendorDetail "success" and status "pending"
    const pendingSuccessDocuments = await Owner.find(
      {
        vendorDetail: "success",
        status: "pending",
      },
      "_id    travelName status images phone name email"
    );

    // Return the list of documents
    res.json(pendingSuccessDocuments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error retrieving pending success documents" });
  }
};
