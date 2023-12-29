const express = require("express");
const {
  addDepartmentaccountPersonaldetails,
  addDepartmentaccountCitizenshipImages,
} = require("../controllers/department");
const {
  approveOwner,
  rejectOwner,
  getOwnerDetails,
  getAllDocuments,
  getPendingSuccessDocuments,
} = require("../controllers/department");

const { ensureMaintenceDepartment } = require("../controllers/auth-department");
const { requireSuperadminSignin } = require("../controllers/auth-owner");
const { uploademployecitizenship } = require("../helpers");

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

  addDepartmentaccountPersonaldetails
);

router.post(
  "/adddepartmentaccount/:departmentId",
  uploademployecitizenship,
  addDepartmentaccountCitizenshipImages
);

module.exports = router;
