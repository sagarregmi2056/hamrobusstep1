const express = require("express");

const {
  updateOwnerStatus,
  approveOwner,
  rejectOwner,
  getOwnerDetails,
  getAllDocuments,
  getPendingSuccessDocuments,
} = require("../controllers/admin.js");
const { requireSuperadminSignin } = require("../controllers/auth-owner");
// const { getAllUsers,userById } = require("../controllers/user");

const router = express.Router();
// recently added routes
router.get("/allowners/:ownerId", requireSuperadminSignin, getOwnerDetails);

router.get("/alldocuments", requireSuperadminSignin, getAllDocuments);

router.get(
  "/pendingsuccessdocuments",
  requireSuperadminSignin,
  getPendingSuccessDocuments
);

router.put("/owners/status", requireSuperadminSignin, updateOwnerStatus);

router.put("/owners/:ownerId", requireSuperadminSignin, updateOwnerStatus);
// Route to approve an owner
router.put("/owners/:ownerId/approve", requireSuperadminSignin, approveOwner);

// Route to rejecting  owner with a reason yaha chai reject chai hamro reason ho
router.put("/owners/:ownerId/reject", requireSuperadminSignin, rejectOwner);

// old routes

// router.get("/:ownerId", requireSuperadminSignin, read);

// router.put("/:ownerId", requireSuperadminSignin, update);

// router.get("/", requireSuperadminSignin, getAllUsers);

// router.get("/:userid", requireSuperadminSignin, userById);
// router.param("ownerId", ownerById);

module.exports = router;
