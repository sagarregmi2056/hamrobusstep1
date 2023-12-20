const Owner = require("../models/Owner");
const jwt = require("jsonwebtoken");

const _ = require("lodash");
const FormData = require("form-data");

const axios = require("axios");

exports.stepone = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    const {
      travelName,
      pincode,
      state,
      city,
      phone,
      email,
      name,
      country,
      district,
    } = req.body;

    const ownerExists = await Owner.findOne({ email });

    if (ownerExists) {
      return res.status(403).json({
        error: "Owner with that email already exists",
      });
    }

    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      {
        travelName,
        pincode,
        state,
        city,
        phone,
        email,
        name,
        country,
        district,
        vendorDetail: "bankDetail",
      },
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({
        error: "Owner not found or not updated",
      });
    }

    // Return only essential information
    res.json({
      ownerId: updatedOwner._id,
      message: "Step one completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating owner in Step 1" });
  }
};

//  this is for the step  of owner verification
exports.steptwo = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    const {
      bankName,
      accountNumber,
      beneficaryName,
      bankaccountType,
      citizenshipNumber,
    } = req.body;

    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      {
        bankName,
        accountNumber,
        beneficaryName,
        bankaccountType,
        citizenshipNumber,
        vendorDetail: "panDetail",
      },
      { new: true }
    );

    // Return any relevant information for the frontend
    res.json({
      ownerId: updatedOwner._id,
      message: "Step two completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating owner in Step 2" });
  }
};

exports.stepthree = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    const { panName, panAddress, issuedate, dateofbirth } = req.body;

    const finalOwner = await Owner.findByIdAndUpdate(
      ownerId,
      {
        panName,
        panAddress,
        issuedate,
        dateofbirth,
        vendorDetail: "documentsDetail",
      },
      { new: true }
    );

    // Return any relevant information for the frontend
    res.json({
      ownerId: finalOwner._id,
      message: "Step three completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating owner in Step 3" });
  }
};

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
    // console.log("Cloudflare API Response:", response.data);

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

exports.uploaddriverlisencecontroller = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    // console.log(ownerId);
    const imageType = "driverlicense"; // Assuming this is the type for driver's license

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Save the image URL to the Owner schema based on image type
    await Owner.findByIdAndUpdate(ownerId, {
      $push: { images: { type: imageType, url: imageUrl } },
    });

    res.json({
      url: imageUrl,
      message: `Driver's license image URL saved to Owner schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadPanCardController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    // console.log(ownerId);
    const imageType = "pancard"; // Assuming this is the type for PAN card

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Save the image URL to the Owner schema based on image type
    await Owner.findByIdAndUpdate(ownerId, {
      $push: { images: { type: imageType, url: imageUrl } },
    });

    res.json({
      // Include the bus ID in the response
      url: imageUrl,
      message: `Bus image URL saved to Bus schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.citizenshipController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    console.log(ownerId);
    const imageType = "citizenship"; // Assuming this is the type for PAN card

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Save the image URL to the Owner schema based on image type
    await Owner.findByIdAndUpdate(ownerId, {
      $push: { images: { type: imageType, url: imageUrl } },
      vendorDetail: "success",
    });
    const updatedOwner = await Owner.findOne({ _id: ownerId });

    res.json({
      url: imageUrl,
      vendorDetail: updatedOwner.vendorDetail,
      message: `Citizenship image URL saved to Owner schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.nationalidController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    console.log(ownerId);
    const imageType = "nationalid"; // Assuming this is the type for PAN card

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Save the image URL to the Owner schema based on image type
    await Owner.findByIdAndUpdate(ownerId, {
      $push: { images: { type: imageType, url: imageUrl } },
    });

    res.json({
      url: imageUrl,

      message: `nationalid image URL saved to Owner schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOwnerDocumentsController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    // Retrieve the owner's documents
    const ownerDocuments = owner.images;

    res.json({
      ownerDocuments,
      message: "Owner documents retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving owner documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getOwnerDetails = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;

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

exports.requireOwnerSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);

    const foundowner = await Owner.findById(owner._id).select(
      "name role salt hashed_password"
    );

    if (foundowner && foundowner.role === "owner") {
      req.ownerauth = foundowner;
      next();
    } else res.status(401).json({ error: "Not authorized!" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.refreshToken = async (req, res) => {
  if (req.body && req.body._id) {
    const owner = await Owner.findOne({ _id: req.body._id });

    const payload = {
      _id: owner.id,
      role: owner.role,
      phone: owner.phone,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET /*{ expiresIn: 5 }*/
    );

    return res.json({ token });
  }
  return res.json({ error: "Invalid content" });
};

exports.ownersigninverify = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);
    // console.log("hehe")

    const foundowner = await Owner.findById(owner._id).select(
      " _id role phone "
    );

    // console.log("hehe")

    if (foundowner && foundowner.role === "owner") {
      // console.log("hehe")
      req.ownerauth = foundowner;
      next();
    } else res.status(401).json({ error: "Not authorized!" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.requireOwnerSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);

    if (owner) {
      const foundOwner = await Owner.findById(owner._id).select(
        "role phone status vendorDetail"
      );

      if (
        foundOwner &&
        foundOwner.role === "owner" &&
        foundOwner.status === "approved" &&
        foundOwner.vendorDetail === "success"
      ) {
        req.ownerauth = foundOwner;
        next();
      } else {
        res.status(401).json({ error: "Not authorized!" });
      }
    } else {
      res.status(401).json({ error: "Not authorized " });
    }
  } else {
    res.status(401).json({ error: "Not authorized token not available" });
  }
};

function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
}

exports.requireSuperadminSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);

    const foundowner = await Owner.findById(owner._id).select("name role");

    if (foundowner && foundowner.role === "superadmin") {
      req.ownerauth = foundowner;
      next();
    } else res.status(401).json({ error: "Not authorized!" });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.isPoster = (req, res, next) => {
  let sameUser =
    req.bus &&
    req.ownerauth &&
    req.bus.owner._id.toString() === req.ownerauth._id.toString();
  let adminUser =
    req.bus && req.ownerauth && req.ownerauth.role === "superadmin";

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

exports.isBookingOwner = (req, res, next) => {
  let sameUser =
    req.booking &&
    req.ownerauth &&
    req.booking.owner._id.toString() === req.ownerauth._id.toString();

  let adminUser =
    req.booking && req.ownerauth && req.ownerauth.role === "superadmin";

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

exports.isAuth = (req, res, next) => {
  let user =
    req.ownerprofile &&
    req.ownerauth &&
    req.ownerprofile._id.toString() === req.ownerauth._id.toString();
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
