const express = require("express");


const {
  getAllAdminOwners,
  updateOwnerStatus,
  
} = require("../controllers/admin.js")
const { requireSuperadminSignin } = require("../controllers/auth-owner");
const { getAllUsers,userById } = require("../controllers/user");

const router = express.Router();
// recently added routes
router.get("/allowners", requireSuperadminSignin,getAllAdminOwners );
router.put("/owners/status", requireSuperadminSignin, updateOwnerStatus);

// router.get("/:ownerId", requireSuperadminSignin, read);

// router.put("/:ownerId", requireSuperadminSignin, update);

// router.get("/", requireSuperadminSignin, getAllUsers);

// router.get("/:userid", requireSuperadminSignin, userById);
// router.param("ownerId", ownerById);

module.exports = router;
