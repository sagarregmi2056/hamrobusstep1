const express = require("express");
const multer = require("multer");
// import { owner } from './../seeds/superadmin';

const {
  signup,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { userSignupValidator} = require("../validator");






// const { uploadBusImage,uploadnationalId,uploadOwnerAvatar } = require("../helpers");


// updated code
// const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');
const { uploadowner } = require("../helpers");
const { verifyToken } = require("../controllers/otpauth");


const router = express.Router();






router.post('/signup',verifyToken,uploadowner,userSignupValidator,signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)


module.exports = router;

