const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dfqc0mmdn",
  api_key: "911271566348617",
  api_secret: "pTnckyR9sxnKdtBgNDVGYQEDAnc",
});

const storage = multer.memoryStorage(); // Use memory storage for Cloudinary

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg") {
    return callback(new Error("Not Image"));
  }

  // Implement your file filter logic here
  // For example, check file type, size, etc.
  cb(null, true); // Accept the file
};

const upload = multer({ storage, fileFilter });

const uploadFields = [
  { name: "citizenship", maxCount: 1 },
  { name: "DriverLisence", maxCount: 1 },
  { name: "pancard", maxCount: 1 },
];
const uploadowner = upload.fields(uploadFields);
module.exports = { uploadowner };
