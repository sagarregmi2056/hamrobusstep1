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
      file.fieldname + "-" +  Date.now() + path.extname(file.originalname)
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
      file.fieldname + "-" +  Date.now() + path.extname(file.originalname)
    );
  },
});

//  yo chai pan card ko lagi

const PanCardImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/PanCardImage");
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
    cb(null, "./public/uploads/citizenshipImage");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() +  path.extname(file.originalname)
    );
  },
});

const nationalID = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/nationalID");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now()+ path.extname(file.originalname)
    );
  },
});



const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg') {
    return callback(new Error('Not Image'))
  }
  callback(null, true)
}
// const limits = { fileSize: 2480 * 3230 }
//management of the storage and the file that will be uploaded
//.single expects the name of the file input field
exports.uploadBusImage = multer({ storage: busImage ,fileFilter}).single("image");

exports.uploadOwnerAvatar = multer({ storage: ownerAvatar,fileFilter }).array("photo");

// newly added avatar

exports.uploadnationalID = multer({ storage: nationalID,fileFilter }).array("nationalID");
exports.uploadCitizenshipimage = multer({ storage: citizenshipImage }).array(
  "citizenship"
);
exports.uploaddriverlisence = multer({ storage: lisence,fileFilter }).array("DriverLisence");
exports.uploadpancard = multer({ storage: PanCardImage,fileFilter }).array(
  "pancard"
);
