const express = require("express");
const {
  addDepartmentaccountPersonaldetails,
  addDepartmentaccountCitizenshipImages,
  updateDepartment,
  updateDepartmentCitizenshipImages,
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

// maintence department

router.get(
  "/ownerdetails/:ownerId",
  ensureMaintenceDepartment,
  getOwnerDetails
);

router.get("/alldocuments", ensureMaintenceDepartment, getAllDocuments);
router.get(
  "/pendingsuccessdocuments",
  ensureMaintenceDepartment,
  getPendingSuccessDocuments
);

router.put("/owners/:ownerId/approve", ensureMaintenceDepartment, approveOwner);
router.put("/owners/:ownerId/reject", ensureMaintenceDepartment, rejectOwner);

// guard left
// superadmin department
router.post(
  "/adddepartmentaccount",
  requireSuperadminSignin,

  addDepartmentaccountPersonaldetails
);

router.post(
  "/adddepartmentcitizen/:departmentId",
  requireSuperadminSignin,
  uploademployecitizenship,
  addDepartmentaccountCitizenshipImages
);

// the id that has been given by us ,custom departmentid
router.post(
  "/updatedepartmentaccount/:departmentId",
  requireSuperadminSignin,
  updateDepartment
);
router.put(
  "/updatedepartmentcitizen/:departmentId",
  requireSuperadminSignin,
  uploademployecitizenship,
  updateDepartmentCitizenshipImages
);

//

module.exports = router;
