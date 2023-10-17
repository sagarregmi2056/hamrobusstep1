const express = require("express");
const multer = require("multer");
// import { owner } from './../seeds/superadmin';

const {
  signup,
  submitdata,
 
  signin,
  refreshToken
} = require("../controllers/auth-owner");

// const { userSignupValidator} = require("../validator");






// const { uploadBusImage,uploadnationalId,uploadOwnerAvatar } = require("../helpers");


// updated code
const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');


const router = express.Router();






router.post('/signup',uploadpancard, signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

