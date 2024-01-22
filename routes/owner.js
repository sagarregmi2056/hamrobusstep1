const express = require("express");
const router = express.Router();
const {
  ownerById,
  read,
  update,
  myprofile,
  profilepictureController,
  updateProfilePictureController,
  updateOwnerDetails,
} = require("../controllers/owner");
const {
  requireOwnerSignin,
  isAuth,
  ownersigninverify,
} = require("../controllers/auth-owner");
const { verifyToken } = require("../controllers/otpauth");
const { uploadprofilepic } = require("../helpers");
const { imageValidator } = require("../validator");
// const { uploadOwnerAvatar } = require("../helpers");

router.get("/myprofile", requireOwnerSignin, myprofile);
router.put(
  "/updateuserdetails",
  verifyToken,
  ownersigninverify,
  updateOwnerDetails
);

router.post(
  "/addprofilepic",
  verifyToken,
  ownersigninverify,
  uploadprofilepic,
  imageValidator,
  profilepictureController
);

router.put(
  "/updateprofilepic",
  verifyToken,
  ownersigninverify,
  uploadprofilepic,
  imageValidator,
  updateProfilePictureController
);

router.put("/:ownerId", requireOwnerSignin, isAuth, update);
router.get("/:ownerId", read);

router.param("ownerId", ownerById);

module.exports = router;
