const Owner = require("../models/Owner");
const _ = require("lodash");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
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

exports.getAllOwners = async (req, res) => {
  const owners = await Owner.find()
    .sort({ created: -1 })
    .select("name email phone createdAt updatedAt role");
  res.json(owners);
};

exports.ownerById = async (req, res, next, id) => {
  // searching by id and placing on owner variable
  const owner = await Owner.findById(id);
  if (owner) {
    // frontend ma password ra salt jana bata rokna paryo
    owner.salt = undefined;
    owner.hashed_password = undefined;

    // owner ma ayako data assign garyako
    req.ownerprofile = owner;
    next();
  } else {
    res.status(400).json({ error: "Owner not found!" });
  }
};

// just sending data as json which is assigned above
exports.read = (req, res) => {
  return res.json(req.ownerprofile);
};

exports.update = async (req, res) => {
  let formbody = {};

  if (req.file !== undefined) {
    const { filename: photo } = req.file;

    //Compress photo
    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 100 })
      .toFile(path.resolve(req.file.destination, "resized", photo));
    fs.unlinkSync(req.file.path);
    req.body.photo = "ownerAvatar/resized/" + photo;
    formbody = { photo: req.body.photo };
  }

  let owner = req.ownerauth;

  if (req.body.oldPassword && req.body.newPassword) {
    if (!owner.authenticate(req.body.oldPassword)) {
      return res.status(401).json({
        error: "Password does not match",
      });
    } else {
      formbody = { ...formbody, password: req.body.newPassword };
    }
  }

  owner = _.extend(owner, formbody);

  await owner.save();

  owner.hashed_password = undefined;
  owner.salt = undefined;

  res.json(owner);
};

exports.myprofile = async (req, res) => {
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

    const profilepicImageUrls = ownerDetails.images
      .filter((image) => image.type === "profilepic")
      .map((image) => image.url);

    // Return owner details, including vendorDetail and status
    const responseData = {
      travelName: ownerDetails.travelName,
      phone: ownerDetails.phone,
      email: ownerDetails.email,
      name: ownerDetails.name,
      status: ownerDetails.status,
    };

    // Check if profilepicImageUrls is not empty before including it in the response
    if (profilepicImageUrls.length > 0) {
      responseData.images = profilepicImageUrls;
    } else {
      // If no profile pictures, include a default image URL
      responseData.defaultImage =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvh61dMSiACmZo833XOZOUtTMZbXPGdvP35IGcBVw2aQ&s";
    }

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving owner details" });
  }
};

exports.profilepictureController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    console.log(ownerId);
    const imageType = "profilepic"; // Assuming this is the type for PAN card

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

      message: `profile picture URL saved to Owner schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProfilePictureController = async (req, res) => {
  try {
    // const ownerId = req.params.ownerId;
    const ownerId = req.ownerauth;
    console.log(ownerId);
    const imageType = "profilepic"; // Assuming this is the type for profile picture

    // Check if the owner exists
    const owner = await Owner.findOne({ _id: ownerId });
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Find and update the existing profile picture URL
    const existingProfilePicture = owner.images.find(
      (image) => image.type === imageType
    );

    if (existingProfilePicture) {
      // Save the new image URL and remove the previous one
      await Owner.findOneAndUpdate(
        { _id: ownerId, "images.type": imageType },
        {
          $set: {
            "images.$.url": imageUrl,
          },
          $pull: {
            images: { type: imageType, url: { $ne: imageUrl } },
          },
        }
      );

      // You may want to uncomment and implement the removeImageFromStorage function here
      // await removeImageFromStorage(existingProfilePicture.url);

      res.json({
        url: imageUrl,
        message: "Profile picture updated successfully",
      });
    } else {
      // If no existing profile picture, simply add the new one
      await Owner.findByIdAndUpdate(ownerId, {
        $push: { images: { type: imageType, url: imageUrl } },
      });

      res.json({
        url: imageUrl,
        message: "Profile picture saved to Owner schema successfully",
      });
    }
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
