const express = require("express");
// import { owner } from './../seeds/superadmin';

const {
  signup,
  uploadDocumentImages,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { userSignupValidator} = require("../validator");
// const {
 
//   uploadnationalId,
//   uploadCitizenshipimage,
//   uploaddriverlisence,
//   uploadpancard,
// } = require('../helpers');

// const { uploadBusImage,uploadnationalId,uploadOwnerAvatar } = require("../helpers");


// updated code
const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers');


const router = express.Router();






// router.post("/signup",userSignupValidator,uploadBusImage,uploadnationalId,signup);


// updated code

router.post(
  '/signup',uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard,
  // uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard, // Validation middleware for owner signup
  uploadDocumentImages // Owner signup controller function
);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

