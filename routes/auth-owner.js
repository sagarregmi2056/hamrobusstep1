const express = require("express");
const multer = require("multer");
const Owner = require("../models/Owner");
const app = express();
const {
  stepfour,
  signin,
  refreshToken,
  stepone,
  steptwo,
  stepthree,
  getOwnerDetails,
  uploaddriverlisencecontroller,
  uploadPanCardController,
  getOwnerDocumentsController,
  citizenshipController,
  nationalidController,
} = require("../controllers/auth-owner");

// updated code
// const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');

const { verifyToken } = require("../controllers/otpauth");
const {
  uploaddriverlisence,
  uploadCitizenshipimages,
  uploadnationalID,
} = require("../helpers");
const { uploadpancard } = require("../helpers");

const router = express.Router();

/**
 * @swagger
 * /api/auth-owner/addPersonalDetail/{ownerId}:
 *   post:
 *     summary: Add Personal Detail
 *     description: Adds personal details for the owner.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelName:
 *                 type: string
 *                 description: Name of the travel
 *               pincode:
 *                 type: string
 *                 description: Pincode of the location
 *               state:
 *                 type: string
 *                 description: State of the location
 *               city:
 *                 type: string
 *                 description: City of the location
 *               phone:
 *                 type: string
 *                 description: Owner's phone number
 *               email:
 *                 type: string
 *                 description: Owner's email address
 *               name:
 *                 type: string
 *                 description: Owner's name
 *               country:
 *                 type: string
 *                 description: Country of the location
 *               district:
 *                 type: string
 *                 description: District of the location
 *     responses:
 *       200:
 *         description: Personal details added successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               message: 'Step one completed successfully'
 *       403:
 *         description: Owner with that email already exists
 *         content:
 *           application/json:
 *             example:
 *               error: 'Owner with that email already exists'
 *       404:
 *         description: Owner not found or not updated
 *         content:
 *           application/json:
 *             example:
 *               error: 'Owner not found or not updated'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error updating owner in Step 1'
 */

router.post("/addPersonalDetail/:ownerId", verifyToken, stepone);

/**
 * @swagger
 * /api/auth-owner/addBankDetail/{ownerId}:
 *   put:
 *     summary: Add Bank Detail
 *     description: Adds bank details for the owner.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 description: Name of the bank
 *               accountNumber:
 *                 type: string
 *                 description: Owner's bank account number
 *               beneficaryName:
 *                 type: string
 *                 description: Beneficiary name for the bank account
 *               bankaccountType:
 *                 type: string
 *                 description: Type of bank account (e.g., Savings, Checking)
 *               citizenshipNumber:
 *                 type: string
 *                 description: Owner's citizenship number
 *     responses:
 *       200:
 *         description: Bank details added successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               message: 'Step two completed successfully'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error updating owner in Step 2'
 */

router.put("/addBankDetail/:ownerId", verifyToken, steptwo);
/**
 * @swagger
 * /api/auth-owner/addPanDetail/{ownerId}:
 *   put:
 *     summary: Add PAN Detail
 *     description: Adds PAN details for the owner.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: ID of the owner
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               panName:
 *                 type: string
 *                 description: Name on the PAN card
 *               panAddress:
 *                 type: string
 *                 description: Address on the PAN card
 *               issuedate:
 *                 type: string
 *                 format: date
 *                 description: |
 *                   Date of issue (format: YYYY-MM-DD)
 *               dateofbirth:
 *                 type: string
 *                 format: date
 *                 description: |
 *                   Date of birth (format: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: PAN details added successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               message: 'Step three completed successfully'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error updating owner in Step 3'
 */

router.put("/addPanDetail/:ownerId", stepthree);

router.get("/getCurrentSection/:ownerId", verifyToken, getOwnerDetails);
// router.post("/adddocuments/:ownerId/pancard", stepfour);
router.post(
  "/adddocuments/:ownerId/driverlicense",
  uploaddriverlisence,
  uploaddriverlisencecontroller
);

router.get("/getownerdocuments/:ownerId", getOwnerDocumentsController);

router.post(
  "/adddocuments/:ownerId/pancard",
  uploadpancard,
  uploadPanCardController
);

router.post(
  "/adddocuments/:ownerId/citizenship",
  uploadCitizenshipimages,
  citizenshipController
);

router.post(
  "/adddocuments/:ownerId/nationalid",
  uploadnationalID,
  nationalidController
);

router.post("/signin", signin);
router.post("/refreshtoken", refreshToken);

module.exports = router;
