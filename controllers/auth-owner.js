const Owner = require("../models/Owner");
const jwt = require("jsonwebtoken");
const _ = require("lodash");





const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const {
  uploadOwnerAvatar,

  uploadCitizenshipimage,
  uploaddriverlisence,
  uploadpancard,
  uploadnationalID,
} = require('../helpers');


// exports.signup = async (req, res) => {

// //  console.log(req.body.email);

//   const ownerExists = await Owner.findOne({ email: req.body.email });



//   if (ownerExists)
//     return res.status(403).json({
//       error: "Email is taken!"
//     });
//   const newowner = new Owner(req.body);
//   const owner = await newowner.save();

  

//   owner.salt = undefined;
//   owner.hashed_password = undefined;
//   res.json(owner);
// };



// updated code






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

//       uploadnationalId(req, res, async (uploadnationalIdError) => {
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
//                 newOwner.nationalID = 'nationalid/' + req.file2.filename;
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
//       });
//     });
//   };



exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });

  if (!owner) {
    return res.status(401).json({
      error: "owner with that email does not exist."
    });
  }

  if (!owner.authenticate(password)) {
    return res.status(401).json({
      error: "Email and password do not match"
    });
  }

  const payload = {
    _id: owner.id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
    refresh_hash: owner.salt,
    avatar: owner.photo || null
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h' });

  return res.json({ token });
};

exports.refreshToken = async (req, res) => {
  if (req.body && req.body._id) {
    const owner = await Owner.findOne({ _id: req.body._id });

    const payload = {
      _id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      refresh_hash: owner.salt,
      avatar: owner.photo || null
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

    const foundowner = await Owner.findById(owner._id).select("name role salt hashed_password");

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
      error: "User is not authorized to perform this action"
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
      error: "User is not authorized to perform this action"
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
      error: "Access denied"
    });
  }
  next();
};


exports.signup = async (req, res) => {
  try {
    const ownerExists = await Owner.findOne({ email: req.body.email }).exec();
    
    if (ownerExists) {
      return res.status(403).json({ error: 'Email is taken' });
    }

    // Handle file uploads using Multer middleware
    const uploadOwnerAvatarPromise = new Promise((resolve, reject) => {
      uploadOwnerAvatar.single('photo')(req, res, (uploadOwnerAvatarError) => {
        if (uploadOwnerAvatarError) {
          reject('Owner avatar upload failed');
        } else {
          resolve();
        }
      });
    });

    const uploadnationalIdPromise = new Promise((resolve, reject) => {
      uploadnationalID.single('nationalID')(req, res, (uploadnationalIDError) => {
        if (uploadnationalIDError) {
          reject('National ID upload failed');
        } else {
          resolve();
        }
      });
    });

    const uploadCitizenshipimagePromise = new Promise((resolve, reject) => {
      uploadCitizenshipimage.single('citizenship')(req, res, (uploadCitizenshipimageError) => {
        if (uploadCitizenshipimageError) {
          reject('Citizenship image upload failed');
        } else {
          resolve();
        }
      });
    });

    const uploaddriverlisencePromise = new Promise((resolve, reject) => {
      uploaddriverlisence.single('DriverLisence')(req, res, (uploaddriverlisenceError) => {
        if (uploaddriverlisenceError) {
          reject('Driver license upload failed');
        } else {
          resolve();
        }
      });
    });

    const uploadpancardPromise = new Promise((resolve, reject) => {
      uploadpancard.single('pancard')(req, res, (uploadpancardError) => {
        if (uploadpancardError) {
          reject('Pancard upload failed');
        } else {
          resolve();
        }
      });
    });

    // Await all file upload promises
    await Promise.all([
      uploadOwnerAvatarPromise,
      uploadnationalIdPromise,
      uploadCitizenshipimagePromise,
      uploaddriverlisencePromise,
      uploadpancardPromise,
    ]);

    // Create a new owner
    const newOwner = new Owner(req.body);

    // Modify the owner data to include file paths
    if (req.file) {
      newOwner.photo = 'ownerAvatar/' + req.file.filename;
    }
    if (req.file2) {
      newOwner.nationalID = 'nationalID/' + req.file2.filename;
    }
    if (req.file3) {
      newOwner.citizenship = 'Citizenship/' + req.file3.filename;
    }
    if (req.file4) {
      newOwner.DriverLisence = 'lisence/' + req.file4.filename;
    }
    if (req.file5) {
      newOwner.pancard = 'panCard/' + req.file5.filename;
    }

    const owner = await newOwner.save();

    // Exclude sensitive information from the response
    owner.salt = undefined;
    owner.hashed_password = undefined;

    res.json(owner);
  } catch (error) {
    return res.status(500).json({ error: 'Owner registration failed' });
  }
};



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




  exports.uploadDocumentImages = async (req, res) => {
    try {
      const ownerExists = await Owner.findOne({ email: req.body.email });
      if (ownerExists) {
        return res.status(403).json({ error: 'Email is taken' });
      }
  
      const uploadPromises = [];
  
      // Define an array of image fields and corresponding storage directories
      const imageFields = [
        { fieldname: 'photo', directory: 'ownerAvatar' },
        { fieldname: 'nationalID', directory: 'nationalID' },
        { fieldname: 'citizenship', directory: 'citizenshipImage' },
        { fieldname: 'DriverLisence', directory: 'lisence' },
        { fieldname: 'pancard', directory: 'PanCardImage' },
      ];
  
      for (const fieldInfo of imageFields) {
        if (req.file[fieldInfo.fieldname]) {
          const { filename: image } = req.file[fieldInfo.fieldname];
  
          // Compress image
          await sharp(req.file[fieldInfo.fieldname].path)
            .resize(800)
            .jpeg({ quality: 100 })
            .toFile(path.resolve(req.file[fieldInfo.fieldname].destination, 'resized', image));
          fs.unlinkSync(req.file[fieldInfo.fieldname].path);
  
          req.body[fieldInfo.fieldname] = fieldInfo.directory + '/resized/' + image;
        }
      }
  
      // Continue with saving the owner information
      const newOwner = new Owner(req.body);
      const owner = await newOwner.save();
  
      // Exclude sensitive information from the response
      owner.salt = undefined;
      owner.hashed_password = undefined;
  
      res.json(owner);
    } catch (error) {
      return res.status(500).json({ error: 'Owner registration failed' });
    }
  };
  