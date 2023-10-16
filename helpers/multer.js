const path = require("path");
const multer = require("multer");

//storage management for the file
//that will be uploaded
const busImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/busimage");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// yo chai owner ko photo ko lagi
const ownerAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/ownerAvatar");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//  yo chai pan card ko lagi

const PanCardImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/panCard");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//  llisence 

const lisence= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/lisence");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const citizenshipImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/Citizenship");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const nationalID = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/nationalid");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//management of the storage and the file that will be uploaded
//.single expects the name of the file input field
exports.uploadBusImage = multer({ storage: busImage }).single("image");
exports.uploadOwnerAvatar = multer({ storage: ownerAvatar }).single("photo");

// newly added avatar

exports.uploadPvtltdAvatar = multer({ storage: nationalID }).single("nationalId");
exports.uploadCitizenshipAvatar = multer({ storage: citizenshipImage }).single(
  "citizenship"
);
exports.uploadChequeAvatar = multer({ storage: lisence }).single("DriverLisence");
exports.uploadPancardAvatar = multer({ storage: PanCardImage }).single(
  "pancard"
);
