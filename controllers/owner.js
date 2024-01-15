const Owner = require("../models/Owner");
const _ = require("lodash");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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

    // Return owner details, including vendorDetail and status
    res.json({
      travelName: ownerDetails.travelName,
      phone: ownerDetails.phone,
      email: ownerDetails.email,
      name: ownerDetails.name,
      status: ownerDetails.status,
      images: ownerDetails.images.map((image) => image.url),

      // Assuming 'status' is a property of the Owner model
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving owner details" });
  }
};
