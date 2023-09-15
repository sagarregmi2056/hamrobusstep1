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
    cb(null, "./public/uploads/ownerAvatar");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//  chequeAvatar

const ChequeAvatar = multer.diskStorage({
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

const citizenshipNumber = multer.diskStorage({
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

const PvtLtdImages = multer.diskStorage({
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

//management of the storage and the file that will be uploaded
//.single expects the name of the file input field
exports.uploadBusImage = multer({ storage: busImage }).single("image");
exports.uploadOwnerAvatar = multer({ storage: ownerAvatar }).single("photo");
exports.uploadOwnerAvatar = multer({ storage: PvtLtdImages }).single("pvtltd");
exports.uploadOwnerAvatar = multer({ storage: citizenshipNumber }).single(
  "citizenship"
);

ChequeAvatar;
