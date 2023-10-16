const express = require("express");

const {
  signup,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { userSignupValidator } = require("../validator");
// const { signup } = require("../controllers/auth-user");

const router = express.Router();






router.post("/signup",userSignupValidator,signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

