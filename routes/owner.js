const express = require("express");
const router = express.Router();
const { ownerById, read, update, myprofile } = require("../controllers/owner");
const { requireOwnerSignin, isAuth } = require("../controllers/auth-owner");
// const { uploadOwnerAvatar } = require("../helpers");

router.get("/:ownerId", read);

router.get("/myprofile", requireOwnerSignin, myprofile);

router.put("/:ownerId", requireOwnerSignin, isAuth, update);

router.param("ownerId", ownerById);

module.exports = router;
