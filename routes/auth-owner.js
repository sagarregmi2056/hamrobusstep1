const express = require("express");

const {
  signup,
  signin,
  refreshToken
} = require("../controllers/auth-owner");

const { userSignupValidator, kfcverification } = require("../validator");

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



router.post("/signup",signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken)

module.exports = router;

