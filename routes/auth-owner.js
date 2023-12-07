const express = require("express");
const multer = require("multer");
const Owner = require("../models/Owner");
const app = express();
const {
  stepfour,
  signin,
  refreshToken,
  stepone,
  steptwo,
  stepthree,
  getOwnerDetails,
  uploaddriverlisencecontroller,
  uploadPanCardController,
  getOwnerDocumentsController,
  citizenshipController,
  nationalidController,
} = require("../controllers/auth-owner");

// updated code
// const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');

const { verifyToken } = require("../controllers/otpauth");
const {
  uploaddriverlisence,
  uploadCitizenshipimages,
  uploadnationalID,
} = require("../helpers");
const { uploadpancard } = require("../helpers");

const router = express.Router();

router.post("/addPersonalDetail/:ownerId", verifyToken, stepone);

router.put("/addBankDetail/:ownerId", steptwo);

router.put("/addPanDetail/:ownerId", stepthree);

router.get("/getCurrentSection/:ownerId", verifyToken, getOwnerDetails);
// router.post("/adddocuments/:ownerId/pancard", stepfour);
router.post(
  "/adddocuments/:ownerId/driverlicense",
  uploaddriverlisence,
  uploaddriverlisencecontroller
);

router.get("/getownerdocuments/:ownerId", getOwnerDocumentsController);

router.post(
  "/adddocuments/:ownerId/pancard",
  uploadpancard,
  uploadPanCardController
);

router.post(
  "/adddocuments/:ownerId/citizenship",
  uploadCitizenshipimages,
  citizenshipController
);

router.post(
  "/adddocuments/:ownerId/nationalid",
  uploadnationalID,
  nationalidController
);

router.post("/signin", signin);
router.post("/refreshtoken", refreshToken);

module.exports = router;
