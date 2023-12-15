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

/**
 * @swagger
 * /api/admin/allowners/{ownerId}:
 *   get:
 *     summary: Get Owner Details
 *     description: Retrieves details of a specific owner.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               travelName: 'SampleTravel'
 *               pincode: '12345'
 *               state: 'SampleState'
 *               city: 'SampleCity'
 *               phone: '1234567890'
 *               email: 'owner@example.com'
 *               name: 'Owner Name'
 *               country: 'SampleCountry'
 *               district: 'SampleDistrict'
 *               vendorDetail: 'bankDetail'
 *               status: 'active'
 *               panNumber: 'ABCPN1234C'
 *               panName: 'PAN Owner Name'
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Owner not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error retrieving owner details'
 */
// recently added routes
router.get("/allowners/:ownerId", requireSuperadminSignin, getOwnerDetails);

router.get("/alldocuments", requireSuperadminSignin, getAllDocuments);

router.get(
  "/pendingsuccessdocuments",
  requireSuperadminSignin,
  getPendingSuccessDocuments
);

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
