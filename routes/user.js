const express = require("express");
const router = express.Router();
const { userById, read, getAllUsers } = require("../controllers/user");
const { requireSuperadminSignin } = require("../controllers/auth-owner");

// requiresuperadmin signin baki xa hai

router.get("/", getAllUsers);

router.get("/:userId", read);

router.param("userId", userById);
module.exports = router;
