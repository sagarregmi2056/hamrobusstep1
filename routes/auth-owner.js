const express = require("express");
const multer = require("multer");
// import { owner } from './../seeds/superadmin';

const {
  signup,
  signin,
  refreshToken,
  stepone,
  steptwo,
  stepthree,
  getOwnerDetails
} = require("../controllers/auth-owner");

const { userSignupValidator} = require("../validator");






// const { uploadBusImage,uploadnationalId,uploadOwnerAvatar } = require("../helpers");


// updated code
// const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');
const { uploadowner } = require("../helpers");
const { verifyToken } = require("../controllers/otpauth");


const router = express.Router();





router.post('/addPersonalDetail/:ownerId',verifyToken,stepone);


router.put('/addBankDetail/:ownerId',steptwo);

router.put('/addPanDetail/:ownerId',stepthree);

router.get('/getCurrentSection/:ownerId',getOwnerDetails);




// first am removing verifytoken function from here we will add it after some testing    verifyToken,

router.post('/signup',uploadowner,userSignupValidator,signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)


module.exports = router;

