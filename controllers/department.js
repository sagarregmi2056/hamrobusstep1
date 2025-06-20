const Department = require("../models/Departments");

const Owner = require("../models/Owner");
const _ = require("lodash");
const FormData = require("form-data");

const axios = require("axios");

async function uploadToCloudflare(image) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // Construct form data using the form-data library
    const formData = new FormData();
    formData.append("file", image, { filename: "file.jpg" });

    // Make the API request
    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/f6cbe271191b3ad841b63ec6b129869d/images/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    // Log the complete response for inspection
    console.log("Cloudflare API Response:", response.data);

    // Check if the response contains the expected data structure
    if (
      response.data.result &&
      response.data.result.variants &&
      response.data.result.variants.length > 0
    ) {
      // Extract the URL from the variants array
      const imageUrl = response.data.result.variants[0];

      return imageUrl;
    } else {
      throw new Error("Unexpected response format from Cloudflare API");
    }
  } catch (error) {
    console.error(
      "Error handling image upload:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// exports.addDepartmentaccount = async (req, res) => {
//   try {
//     const { name, description, departmentId, password, role } = req.body;

//     const allowedRoles = [
//       "maintenancedepartment",
//       "trainingdepartment",
//       "supportdepartment",
//       "accountdepartment",
//     ];
//     if (role && !allowedRoles.includes(role)) {
//       return res.status(400).json({ error: "Invalid department role" });
//     }

//     const newDepartment = new Department({
//       name,
//       description,
//       departmentId,
//       password,
//       role: role,
//     });

//     // Save the department to the database
//     const savedDepartment = await newDepartment.save();

//     console.log("Department added successfully:", savedDepartment);
//     res.status(201).json(savedDepartment);
//   } catch (error) {
//     console.error("Error adding department:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.addDepartmentaccountPersonaldetails = async (req, res) => {
  try {
    // Extract data from the request body

    const {
      name,
      description,
      mobileNumber,
      zipcode,
      district,
      city,
      address,
      departmentId,
      // Array of images
      bankName,
      beneficiaryName,
      accountNumber,
      accountType,
      role,
      password,
    } = req.body;

    const allowedRoles = [
      "maintenancedepartment",
      "trainingdepartment",
      "supportdepartment",
      "accountdepartment",
    ];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid department role" });
    }

    // Upload images to Cloudflare and replace them in the documents array

    // Create a new department instance with Cloudflare URLs
    const newDepartment = new Department({
      name,
      description,
      mobileNumber,
      zipcode,
      district,
      city,
      address,
      departmentId,

      bankName,
      beneficiaryName,
      accountNumber,
      accountType,
      role,
      password,
    });

    // Save the department to the database
    const savedDepartment = await newDepartment.save();

    // Respond with the saved department data
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addDepartmentaccountCitizenshipImages = async (req, res) => {
  try {
    // Extract data from the request body
    const departmentId = req.params.departmentId;
    // console.log(departmentId);

    const imageType = "employecitizenship";

    // Find the department by ID
    const department = await Department.findById(departmentId);

    // Check if the department exists
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    await Department.findByIdAndUpdate(departmentId, {
      $push: { documents: { type: imageType, url: imageUrl } },
    });

    res.json({
      url: imageUrl,
      message: `employee citizenship URL saved to department schema successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      name,
      description,
      mobileNumber,
      zipcode,
      district,
      city,
      address,
      bankName,
      beneficiaryName,
      accountNumber,
      accountType,
      role,
      password,
    } = req.body;

    const departmentId = req.params.departmentId;

    const allowedRoles = [
      "maintenancedepartment",
      "trainingdepartment",
      "supportdepartment",
      "accountdepartment",
    ];

    // Check if the provided role is valid
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid department role" });
    }

    // Find the department by ID
    const department = await Department.findById(req.params.departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Update the department properties with the provided values
    department.name = name || department.name;
    department.description = description || department.description;
    department.mobileNumber = mobileNumber || department.mobileNumber;
    department.zipcode = zipcode || department.zipcode;
    department.district = district || department.district;
    department.city = city || department.city;
    department.address = address || department.address;
    department.departmentId = departmentId || department.departmentId;
    department.bankName = bankName || department.bankName;
    department.beneficiaryName = beneficiaryName || department.beneficiaryName;
    department.accountNumber = accountNumber || department.accountNumber;
    department.accountType = accountType || department.accountType;
    department.role = role || department.role;
    department.password = password || department.password;

    // Save the updated department document
    const updatedDepartment = await department.save();

    // Respond with the updated department data
    res.json(updatedDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDepartmentCitizenshipImages = async (req, res) => {
  try {
    // Extract data from the request body
    const departmentId = req.params.departmentId;
    const imageType = "employecitizenship";

    // Find the department by ID
    const department = await Department.findById(departmentId);

    // Check if the department exists
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    // Extract updated image buffer from the request body
    const updatedImageBuffer = req.file ? req.file.buffer : null;

    // Upload the updated image to Cloudflare
    const updatedImageUrl = updatedImageBuffer
      ? await uploadToCloudflare(updatedImageBuffer)
      : null;

    // Update the image URL in the documents array
    const updatedDocuments = department.documents.map((document) => {
      if (document.type === imageType) {
        return { type: imageType, url: updatedImageUrl };
      }
      return document;
    });

    // Update the documents array in the department
    department.documents = updatedDocuments;

    // Save the updated department document
    const updatedDepartment = await department.save();

    res.json({
      url: updatedImageUrl,
      message:
        "Employee citizenship URL updated in department schema successfully",
    });
  } catch (error) {
    console.error(error);
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
      images: ownerDetails.images,

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
