const express = require("express");

const {
  register,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { userSignupValidator } = require("../validator");

const router = express.Router();


/**
//  * @swagger
//  *
//  * /admin-signup:
//  *   post:
//  *     description: Admin signup
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: admin
//  *         description: User object
//  *         in:  body
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: users
//  */



router.post("/signup",userSignupValidator,register);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

