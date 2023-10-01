const express = require("express");

const {
  ownerById,
  read,
  update,
  getAllOwners,
} = require("../controllers/owner");
const { requireSuperadminSignin } = require("../controllers/auth-owner");
const { getAllUsers,userById } = require("../controllers/user");

const router = express.Router();
router.get("/allowners", requireSuperadminSignin, getAllOwners);

router.get("/:ownerId", requireSuperadminSignin, read);

router.put("/:ownerId", requireSuperadminSignin, update);

router.get("/", requireSuperadminSignin, getAllUsers);

router.get("/:userid", requireSuperadminSignin, userById);
router.param("ownerId", ownerById);

module.exports = router;
