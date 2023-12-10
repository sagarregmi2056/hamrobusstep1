const Owner = require("../models/Owner");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const _ = require("lodash");
const FormData = require("form-data");

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const { ObjectId } = require("mongoose").Types;

const axios = require("axios");

const multer = require("multer");

const {
  uploadOwnerAvatar,
  uploadnationalID,

  uploadCitizenshipimage,
  uploaddriverlisence,
  uploadpancard,
  // uploadnationalID,
} = require("../helpers");

// Import your Cloudinary setup

exports.stepone = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
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
    res.status(500).json({ error: "Error updating owner in Step 2" });
  }
};

//  this is for the step  of owner verification
exports.steptwo = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
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
    const ownerId = req.params.ownerId;
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

exports.uploaddriverlisencecontroller = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    console.log(ownerId);
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
    const ownerId = req.params.ownerId;
    console.log(ownerId);
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
      url: imageUrl,
      message: `PAN card image URL saved to Owner schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.citizenshipController = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
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
    const ownerId = req.params.ownerId;
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
    const ownerId = req.params.ownerId;

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
    const ownerId = req.params.ownerId;

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

// exports.Isvalidowner = async (req, res) => {

//   try {

//     // Assuming you have the user details available in the request object after authentication

//     // Check if the role is "owner"
//     if (role !== 'owner') {
//       return res.status(403).json({ error: 'Access denied. User is not an owner.' });
//     }

//     // If the user has the "owner" role, proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.requireOwnerSignin = async (req, res, next) => {
//   const token = req.headers.authorization;

//   if (token) {
//     const owner = parseToken(token);
//     // console.log("hehe")

//     const foundowner = await Owner.findById(owner._id).select("name role salt hashed_password");

//     // console.log("hehe")

//     if (foundowner && foundowner.role === "owner") {
//       // console.log("hehe")
//       req.ownerauth = foundowner;
//       next();
//     } else res.status(401).json({ error: "Not authorized!" });
//   } else {
//     res.status(401).json({ error: "Not authorized" });
//   }
// };

// function parseToken(token) {
//   try {
//     return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//   } catch (err) {
//     return false;
//   }
// }

// exports.signup = (req, res) => {
//   Owner.findOne({ email: req.body.email }, async (err, ownerExists) => {
//     if (err) {
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (ownerExists) {
//       return res.status(403).json({ error: 'Email is taken' });
//     }

//     // Handle file uploads using Multer
//     uploadOwnerAvatar(req, res, async (uploadOwnerAvatarError) => {
//       if (uploadOwnerAvatarError) {
//         return res.status(500).json({ error: 'Owner avatar upload failed' });
//       }

//       uploadnationalID(req, res, async (uploadnationalIdError) => {
//         if (uploadnationalIdError) {
//           return res.status(500).json({ error: 'National ID upload failed' });
//         }

//         uploadCitizenshipimage(req, res, async (uploadCitizenshipimageError) => {
//           if (uploadCitizenshipimageError) {
//             return res.status(500).json({ error: 'Citizenship image upload failed' });
//           }

//           uploaddriverlisence(req, res, async (uploaddriverlisenceError) => {
//             if (uploaddriverlisenceError) {
//               return res.status(500).json({ error: 'Driver license upload failed' });
//             }

//             uploadpancard(req, res, async (uploadpancardError) => {
//               if (uploadpancardError) {
//                 return res.status(500).json({ error: 'Pancard upload failed' });
//               }

//               // Create a new owner
//               const newOwner = new Owner(req.body);

//               // Modify the owner data to include file paths
//               if (req.file1) {
//                 newOwner.photo = 'ownerAvatar/' + req.file.filename;
//               }
//               if (req.file2) {
//                 newOwner.nationalID = 'nationalID/' + req.file2.filename;
//               }
//               if (req.file3) {
//                 newOwner.citizenship = 'Citizenship/' + req.file3.filename;
//               }
//               if (req.file4) {
//                 newOwner.DriverLisence = 'lisence/' + req.file4.filename;
//               }
//               if (req.file5) {
//                 newOwner.pancard = 'panCard/' + req.file5.filename;
//               }

//               try {
//                 const owner = await newOwner.save();

//                 // Exclude sensitive information from the response
//                 owner.salt = undefined;
//                 owner.hashed_password = undefined;

//                 res.json(owner);
//               } catch (saveError) {
//                 return res.status(500).json({ error: 'Owner registration failed' });
//               }
//             });
//           });
//         });
//     });
//     });
//   })}

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });

  if (!owner) {
    return res.status(401).json({
      error: "owner with that email does not exist.",
    });
  }

  if (!owner.authenticate(password)) {
    return res.status(401).json({
      error: "Email and password do not match",
    });
  }

  const payload = {
    _id: owner.id,

    role: owner.role,
    phone: owner.phone,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  return res.json({ token });
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

exports.requireOwnerSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);
    // console.log("hehe")

    const foundowner = await Owner.findById(owner._id).select("role phone ");

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

// exports.signup = async (req, res) => {

//     const ownerExists = await Owner.findOne({ email: req.body.email });

//     if (ownerExists) {
//       return res.status(403).json({ error: 'Email is taken' });
//     }

//     // Handle file uploads using Multer middleware
//     const uploadOwnerAvatarPromise = new Promise((resolve, reject) => {
//       uploadOwnerAvatar.array('photo')(req, res, (uploadOwnerAvatarError) => {
//         if (uploadOwnerAvatarError) {
//           reject('Owner avatar upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadnationalIdPromise = new Promise((resolve, reject) => {
//       uploadnationalID.array('nationalID')(req, res, (uploadnationalIDError) => {
//         if (uploadnationalIDError) {
//           reject('National ID upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadCitizenshipimagePromise = new Promise((resolve, reject) => {
//       uploadCitizenshipimage.array('citizenship')(req, res, (uploadCitizenshipimageError) => {
//         if (uploadCitizenshipimageError) {
//           reject('Citizenship image upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploaddriverlisencePromise = new Promise((resolve, reject) => {
//       uploaddriverlisence.array('DriverLisence')(req, res, (uploaddriverlisenceError) => {
//         if (uploaddriverlisenceError) {
//           reject('Driver license upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadpancardPromise = new Promise((resolve, reject) => {
//       uploadpancard.array('pancard')(req, res, (uploadpancardError) => {
//         if (uploadpancardError) {
//           reject('Pancard upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     // Await all file upload promises
//     await Promise.all([
//       uploadOwnerAvatarPromise,
//       uploadnationalIdPromise,
//       uploadCitizenshipimagePromise,
//       uploaddriverlisencePromise,
//       uploadpancardPromise,
//     ]);

//     // Create a new owner
//     const newOwner = new Owner(req.body);

//     // Modify the owner data to include file paths
//     if (req.file) {
//       newOwner.photo = 'ownerAvatar/' + req.file.filename;
//     }
//     if (req.file2) {
//       newOwner.nationalID = 'nationalID/' + req.file2.filename;
//     }
//     if (req.file3) {
//       newOwner.citizenship = 'citizenship/' + req.file3.filename;
//     }
//     if (req.file4) {
//       newOwner.DriverLisence = 'lisence/' + req.file4.filename;
//     }
//     if (req.file5) {
//       newOwner.pancard = 'panCard/' + req.file5.filename;
//     }

//     const owner = await newOwner.save();

//     // Exclude sensitive information from the response
//     owner.salt = undefined;
//     owner.hashed_password = undefined;

// };

// exports.signup = async (req, res) => {

//     const ownerExists = await Owner.findOne({ email: req.body.email });

//     if (ownerExists) {
//       return res.status(403).json({ error: 'Email is taken' });
//     }

//     if (req.file !== undefined) {
//       const { filename: image } = req.file;

//       //Compress image
//       await sharp(req.file.path)
//         .resize(800)
//         .jpeg({ quality: 100 })
//         .toFile(path.resolve(req.file.destination, "resized", image));
//       fs.unlinkSync(req.file.path);
//       req.body.image = "busimage/resized/" + image;
//     }

//   }

// exports.uploadDocumentImages = async (req, res) => {
//   try {

//     const uploadPromises = [];

//     // Define an array of image fields and corresponding storage directories
//     const imageFields = [
//       { fieldname: 'photo', directory: 'ownerAvatar' },
//       { fieldname: 'nationalID', directory: 'nationalID' },
//       { fieldname: 'citizenship', directory: 'citizenshipImage' },
//       { fieldname: 'DriverLisence', directory: 'lisence' },
//       { fieldname: 'pancard', directory: 'PanCardImage' },
//     ];

//     for (const fieldInfo of imageFields) {
//       if (req.file[fieldInfo.fieldname]) {
//         const { filename: image } = req.file[fieldInfo.fieldname];

//         // Compress image
//         await sharp(req.file[fieldInfo.fieldname].path)
//           .resize(800)
//           .jpeg({ quality: 100 })
//           .toFile(path.resolve(req.file[fieldInfo.fieldname].destination, 'resized', image));
//         fs.unlinkSync(req.file[fieldInfo.fieldname].path);

//         req.body[fieldInfo.fieldname] = fieldInfo.directory + '/resized/' + image;
//       }
//     }

//     // Continue with saving the owner information
//     const newOwner = new Owner(req.body);
//     const owner = await newOwner.save();

//     // Exclude sensitive information from the response
//     owner.salt = undefined;
//     owner.hashed_password = undefined;

//     res.json(owner);
//   } catch (error) {
//     return res.status(500).json({ error: 'Owner registration failed' });
//   }
// };
// exports.uploadDocumentImages async (req, res) => {

// }
exports.signup = async (req, res) => {
  const ownerExists = await Owner.findOne({ email: req.body.email });
  if (ownerExists)
    return res.status(403).json({
      error: "Email is taken for sure!",
    });
  const newowner = new Owner(req.body);

  const owner = await newowner.save();

  res.json(owner);
};

// exports.submitdata = async (req, res) => {

//     // console.log(req.body.email)

//     // // console.log(req.bo)
//     // const email  = req.body.email;
//     // console.log(email)
//     // // console.log(req.body.email)

//     // // console.log(req.body.email);

//     // // console.log({email});
//     // // Check if the owner with the same email exists
//     // const ownerExists = await Owner.findOne({ email });

//     // if (ownerExists) {

//     //   return res.status(403).json({ error: 'Email is taken ' });
//     // }

//     // Handle file uploads using Multer middleware
//     const uploadOwnerAvatarPromise = new Promise((resolve, reject) => {
//       uploadOwnerAvatar.array('photo', 1)(req, res, (uploadOwnerAvatarError) => {
//         if (uploadOwnerAvatarError) {
//           reject('Owner avatar upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadNationalIDPromise = new Promise((resolve, reject) => {
//       uploadnationalID.array('nationalID', 1)(req, res, (uploadNationalIDError) => {
//         if (uploadNationalIDError) {
//           reject('National ID upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadCitizenshipImagePromise = new Promise((resolve, reject) => {
//       uploadCitizenshipimage.array('citizenship', 1)(req, res, (uploadCitizenshipImageError) => {
//         if (uploadCitizenshipImageError) {
//           reject('Citizenship image upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadDriverLicensePromise = new Promise((resolve, reject) => {
//       uploaddriverlisence.array('DriverLicense', 1)(req, res, (uploadDriverLicenseError) => {
//         if (uploadDriverLicenseError) {
//           reject('Driver license upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     const uploadPanCardPromise = new Promise((resolve, reject) => {
//       uploadpancard.array('panCard', 1)(req, res, (uploadPanCardError) => {
//         if (uploadPanCardError) {
//           reject('Pancard upload failed');
//         } else {
//           resolve();
//         }
//       });
//     });

//     // Await all file upload promises
//     await Promise.all([
//       uploadOwnerAvatarPromise,
//       uploadNationalIDPromise,
//       uploadCitizenshipImagePromise,
//       uploadDriverLicensePromise,
//       uploadPanCardPromise,
//     ]);

//     // Create a new owner
//     const newOwner = new Owner(req.body);

//     // Modify the owner data to include file paths
//     if (req.files && req.files[0]) {
//       newOwner.photo = 'ownerAvatar/' + req.files[0].filename;
//     }

//     // Modify the owner data to include file paths
//     if (req.files && req.files[0]) {
//       newOwner.photo = 'ownerAvatar/' + req.files[0].filename;
//     }
//     if (req.files && req.files[1]) {
//       newOwner.nationalID = 'nationalID/' + req.files[1].filename;
//     }
//     if (req.files && req.files[2]) {
//       newOwner.citizenship = 'Citizenship/' + req.files[2].filename;
//     }
//     if (req.files && req.files[3]) {
//       newOwner.DriverLicense = 'DriverLicense/' + req.files[3].filename;
//     }
//     if (req.files && req.files[4]) {
//       newOwner.pancard = 'pancard/' + req.files[4].filename;
//     }
//     // Modify other fields as well for the other uploaded files

//     // Save the owner to the database
//     const owner = await newOwner.save();

//     // Exclude sensitive information from the response
//     owner.salt = undefined;
//     owner.hashed_password = undefined;

//     res.json(owner);
//   {
//     return res.status(500).json({ error: 'Owner registration failed' });
//   }
// };
