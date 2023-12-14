const path = require("path");
const multer = require("multer");

//storage management for the file
//that will be uploaded
// const busImage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/busimage");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// yo chai owner ko photo ko lagi
// const ownerAvatar = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/ownerAvatar");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

//  yo chai pan card ko lagi

// const PanCardImage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/PanCardImage");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

//  llisence

// const lisence = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/lisence");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const storagee = multer.memoryStorage();

// const citizenshipImage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/citizenshipImage");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const nationalID = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/nationalID");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg") {
    return callback(new Error("Not Image"));
  }
  callback(null, true);
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "photo") cb(null, "./public/uploads/ownerAvatar");
//     if (file.fieldname === "nationalID")
//       cb(null, "./public/uploads/nationalID");
//     if (file.fieldname === "citizenship")
//       cb(null, "./public/uploads/citizenshipimage");
//     if (file.fieldname === "DriverLisence")
//       cb(null, "./public/uploads/lisence");
//     if (file.fieldname === "pancard") cb(null, "./public/uploads/PanCardImage");
//   },

//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const limits = { fileSize: 2480 * 3230 }
//management of the storage and the file that will be uploaded
//.single expects the name of the file input field

// exports.uploadOwnerAvatar = multer({ storage: ownerAvatar, fileFilter }).single(
//   "photo"
// );

// newly added avatar

// exports.uploadnationalID = multer({ storage: nationalID, fileFilter }).fields([
//   { name: "nationalID", maxCount: 1 },
// ]);

// exports.uploadCitizenshipimage = multer({ storage: citizenshipImage }).array(
//   "citizenship",
//   1
// );
// exports.uploaddriverlisence = multer({ storage: lisence, fileFilter }).single(
//   "DriverLisence",
//   1
// );

// working fine
exports.uploaddriverlisence = multer({ storage: storagee, fileFilter }).single(
  "DriverLisence",
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

// exports.uploadowner = multer({ storage: storage, fileFilter }).fields([
//   { name: "photo", maxCount: 1 },
//   { name: "nationalID", maxCount: 1 },
//   { name: "citizenship", maxCount: 1 },
//   { name: "DriverLisence", maxCount: 1 },
//   { name: "pancard", maxCount: 1 },
// ]);
