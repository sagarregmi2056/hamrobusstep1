const express = require("express");
const { addDepartmentaccount } = require("../controllers/department");
const {
  approveOwner,
  rejectOwner,
  getOwnerDetails,
  getAllDocuments,
  getPendingSuccessDocuments,
} = require("../controllers/department");

const { ensureMaintenceDepartment } = require("../controllers/auth-department");
const { requireSuperadminSignin } = require("../controllers/auth-owner");

const router = express.Router();

router.get("/allowners/:ownerId", ensureMaintenceDepartment, getOwnerDetails);
router.get("/alldocuments", ensureMaintenceDepartment, getAllDocuments);
router.get(
  "/pendingsuccessdocuments",
  requireSuperadminSignin,
  getPendingSuccessDocuments
);

router.put("/owners/:ownerId/approve", ensureMaintenceDepartment, approveOwner);
router.put("/owners/:ownerId/reject", ensureMaintenceDepartment, rejectOwner);

// guard left

router.post(
  "/adddepartmentaccount",
  requireSuperadminSignin,
  addDepartmentaccount
);

module.exports = router;
