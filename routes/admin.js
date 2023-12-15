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
 *     tags:
 *       - Admin
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
/**
 * @swagger
 * /api/admin/alldocuments:
 *   get:
 *     summary: Get All Documents
 *     description: Retrieves details of all owners' documents.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owners' documents retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: 'ownerId1'
 *                 images:
 *                   - type: 'documentType1'
 *                     url: 'https://example.com/document1.jpg'
 *                   - type: 'documentType2'
 *                     url: 'https://example.com/document2.jpg'
 *                 phone: '1234567890'
 *               - _id: 'ownerId2'
 *                 images:
 *                   - type: 'documentType3'
 *                     url: 'https://example.com/document3.jpg'
 *                   - type: 'documentType4'
 *                     url: 'https://example.com/document4.jpg'
 *                 phone: '9876543210'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Error retrieving owners' documents"
 */
router.get("/alldocuments", requireSuperadminSignin, getAllDocuments);

/**
 * @swagger
 * /api/admin/pendingsuccessdocuments:
 *   get:
 *     summary: Get Pending Success Documents
 *     description: Retrieves details of owners' documents with pending status for vendorDetail 'success'.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending success documents retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: 'ownerId1'
 *                 images:
 *                   - type: 'documentType1'
 *                     url: 'https://example.com/document1.jpg'
 *                   - type: 'documentType2'
 *                     url: 'https://example.com/document2.jpg'
 *                 phone: '1234567890'
 *               - _id: 'ownerId2'
 *                 images:
 *                   - type: 'documentType3'
 *                     url: 'https://example.com/document3.jpg'
 *                   - type: 'documentType4'
 *                     url: 'https://example.com/document4.jpg'
 *                 phone: '9876543210'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Error retrieving pending success documents"
 */

router.get(
  "/pendingsuccessdocuments",
  requireSuperadminSignin,
  getPendingSuccessDocuments
);
/**
 * @swagger
 * /api/admin/owners/{ownerId}/approve:
 *   put:
 *     summary: Approve Owner
 *     description: Update the status of an owner to "approved."
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner to be approved
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Owner approved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Owner approved successfully
 *               owner:
 *                 _id: 'ownerId'
 *                 status: approved
 *                 # Include other owner details as needed
 *       '404':
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: Owner not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.put("/owners/:ownerId/approve", requireSuperadminSignin, approveOwner);

/**
 * @swagger
 * /api/admin/owners/{ownerId}/reject:
 *   put:
 *     summary: Reject Owner
 *     description: Update the status of an owner to "rejected" and save the rejection reason.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner to be rejected
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 description: Reason for rejecting the owner. If not provided, it will be an empty string.
 *     responses:
 *       '200':
 *         description: Owner rejected successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Owner rejected successfully
 *               reason: 'Rejection reason goes here'
 *               owner:
 *                 _id: 'ownerId'
 *                 status: rejected
 *                 rejectionReason: 'Rejection reason goes here'
 *                 # Include other owner details as needed
 *       '404':
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: Owner not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

// Route to rejecting  owner with a reason yaha chai reject chai hamro reason ho
router.put("/owners/:ownerId/reject", requireSuperadminSignin, rejectOwner);

// old routes

// router.get("/:ownerId", requireSuperadminSignin, read);

// router.put("/:ownerId", requireSuperadminSignin, update);

// router.get("/", requireSuperadminSignin, getAllUsers);

// router.get("/:userid", requireSuperadminSignin, userById);
// router.param("ownerId", ownerById);

module.exports = router;
