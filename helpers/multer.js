const path = require("path");
const multer = require("multer");

const storagee = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg") {
    const multerError = new multer.MulterError();
    multerError.code = "LIMIT_UNEXPECTED_FILE";
    multerError.field = file.fieldname;
    multerError.message =
      "Please upload a valid image file (jpeg, png, gif, jpg)";
    return callback(multerError);
  }
  callback(null, true);
};

// working fine
exports.uploaddriverlisence = multer({ storage: storagee, fileFilter }).single(
  "DriverLisence",
  1
);

exports.uploadprofilepic = multer({ storage: storagee, fileFilter }).single(
  "profilepic",
  1
);
exports.uploadpancard = multer({ storage: storagee, fileFilter }).single(
  "pancard",
  1
);
exports.uploadCitizenshipimages = multer({ storage: storagee }).single(
  "citizenship",
  1
);
exports.uploadnationalID = multer({ storage: storagee, fileFilter }).single(
  "nationalID",
  1
);

exports.uploadBusImage = multer({ storage: storagee, fileFilter }).single(
  "busimage"
);

exports.uploadinsideBusImage = multer({ storage: storagee, fileFilter }).single(
  "businside"
);

exports.uploademployecitizenship = multer({
  storage: storagee,
  fileFilter,
}).single("employecitizenship");
