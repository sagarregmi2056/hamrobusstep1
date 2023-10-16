const express = require("express");
// import { owner } from './../seeds/superadmin';

const {
  signup,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { ownerSignupValidator} = require("../validator");


const router = express.Router();






router.post("/signup",ownerSignupValidator,signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

