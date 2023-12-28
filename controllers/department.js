const Department = require("../models/Departments");

const Owner = require("../models/Owner");

exports.addDepartmentaccount = async (req, res) => {
  try {
    const { name, description, departmentId, password, role } = req.body;

    const allowedRoles = [
      "maintenancedepartment",
      "trainingdepartment",
      "supportdepartment",
      "accountdepartment",
    ];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid department role" });
    }

    const newDepartment = new Department({
      name,
      description,
      departmentId,
      password,
      role: role,
    });

    // Save the department to the database
    const savedDepartment = await newDepartment.save();

    console.log("Department added successfully:", savedDepartment);
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error("Error adding department:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// related to owner which can be verify by only by management department

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
