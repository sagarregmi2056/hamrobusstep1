const express = require("express");
const multer = require("multer");
const Owner = require("../models/Owner");
const app = express();
const {
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
  requireOwnerSignin,
  ownersigninverify,
} = require("../controllers/auth-owner");

const { verifyToken } = require("../controllers/otpauth");
const {
  uploaddriverlisence,
  uploadCitizenshipimages,
  uploadnationalID,
} = require("../helpers");
const { uploadpancard } = require("../helpers");
const { imageValidator } = require("../validator");

// const { ownerById } = require("../controllers/owner");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Owner
 *     description: Operations related to owner
 * /api/auth-owner/addPersonalDetail:
 *   post:
 *     summary: Add Personal Detail
 *     description: Adds personal details for the owner.
 *     tags:
 *       - Owner
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

router.post("/addPersonalDetail", verifyToken, ownersigninverify, stepone);

/**
 * @swagger
 * tags:
 *   - name: Owner
 *     description: Operations related to owner
 * /api/auth-owner/addBankDetail:
 *   put:
 *     summary: Add Bank Detail
 *     description: Adds bank details for the owner.
 *     tags:
 *       - Owner
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
 *               ownerId: '<actual_owner_id>'
 *               message: 'Step two completed successfully'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error updating owner in Step 2'
 */

router.put("/addBankDetail", verifyToken, ownersigninverify, steptwo);
/**
 * @swagger
 * /api/auth-owner/addPanDetail:
 *   put:
 *     summary: Add PAN Detail
 *     description: Adds PAN details for the owner.
 *     tags:
 *       - Owner
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
 *                 description: Owner's PAN number
 *               panAddress:
 *                 type: string
 *                 description: Owner's PAN address
 *               issuedate:
 *                 type: string
 *                 description: Issue date of PAN card
 *               dateofbirth:
 *                 type: string
 *                 description: Date of birth on PAN card
 *     responses:
 *       200:
 *         description: PAN details added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: 'Step three completed successfully'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error updating owner in Step 3'
 */

router.put("/addPanDetail", verifyToken, ownersigninverify, stepthree);
/**
 * @swagger
 * tags:
 *   - name: Owner
 *     description: Operations related to owner
 * /api/auth-owner/getCurrentSection:
 *   get:
 *     summary: Get Current Section
 *     description: Retrieves the current section details for the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current section details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerId: '1234567890'
 *               travelName: "Owner's Travel Name"
 *               pincode: "Owner's Pincode"
 *               state: "Owner's State"
 *               city: "Owner's City"
 *               phone: "Owner's Phone"
 *               email: "Owner's Email"
 *               name: "Owner's Name"
 *               country: "Owner's Country"
 *               district: "Owner's District"
 *               vendorDetail: "Owner's Vendor Detail"
 *               status: "Owner's Status"
 *               panNumber: "Owner's PAN Number"
 *               panName: "Owner's PAN Name"
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

router.get(
  "/getCurrentSection",
  verifyToken,
  ownersigninverify,
  getOwnerDetails
);
// router.post("/adddocuments/:ownerId/pancard", stepfour);

/**
 * @swagger
 * components:
 *   schemas:
 *     DriverLicenseUpload:
 *       type: object
 *       properties:
 *         driverlicense:
 *           type: string
 *           format: binary
 *           description: Driver's license image file
 *
 * /api/auth-owner/adddocuments/driverlicense:
 *   post:
 *     summary: Upload Driver's License
 *     description: Uploads driver's license image for the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DriverLicenseUpload'
 *     responses:
 *       200:
 *         description: Driver's license image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: 'https://example.com/driverlicense.jpg'
 *               message: "Driver's license image URL saved to Owner schema successfully"
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
 *               error: 'Internal Server Error'
 */

router.post(
  "/adddocuments/driverlicense",
  verifyToken,
  ownersigninverify,

  uploaddriverlisence,
  imageValidator,

  uploaddriverlisencecontroller
);

// router.post(
//   "/adddocuments/:ownerId/driverlicense",
//   uploaddriverlisence,
//   uploaddriverlisencecontroller
// );
/**
 * @swagger
 * /api/auth-owner/getownerdocuments:
 *   get:
 *     summary: Get Owner Documents
 *     description: Retrieve documents uploaded by the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []  # Assuming Bearer token authentication is required
 *     responses:
 *       200:
 *         description: Owner documents retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ownerDocuments:
 *                 - type: 'driverlicense'
 *                   url: 'https://example.com/driverlicense.jpg'
 *                 - type: 'pancard'
 *                   url: 'https://example.com/pancard.jpg'
 *                 - type: 'citizenship'
 *                   url: 'https://example.com/citizenship.jpg'
 *                 - type: 'nationalid'
 *                   url: 'https://example.com/nationalid.jpg'
 *               message: 'Owner documents retrieved successfully'
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
 *               error: 'Internal Server Error'
 */
router.get(
  "/getownerdocuments",
  verifyToken,
  ownersigninverify,
  getOwnerDocumentsController
);
/**
 * @swagger
 * /api/auth-owner/adddocuments/pancard:
 *   post:
 *     summary: Upload PAN Card
 *     description: Uploads PAN card image for the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []  # Assuming Bearer token authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PanCardUpload'
 *     responses:
 *       200:
 *         description: PAN card image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: 'https://example.com/pancard.jpg'
 *               message: "PAN card image URL saved to Owner schema successfully"
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
 *               error: 'Internal Server Error'
 */

router.post(
  "/adddocuments/pancard",
  verifyToken,
  ownersigninverify,
  uploadpancard,
  uploadPanCardController
);

/**
 * @swagger
 * /api/auth-owner/adddocuments/citizenship:
 *   post:
 *     summary: Upload Citizenship Document
 *     description: Uploads citizenship image for the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []  # Assuming Bearer token authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CitizenshipUpload'
 *     responses:
 *       200:
 *         description: Citizenship image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: 'https://example.com/citizenship.jpg'
 *               message: "Citizenship image URL saved to Owner schema successfully"
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
 *               error: 'Internal Server Error'
 */

router.post(
  "/adddocuments/citizenship",
  verifyToken,
  ownersigninverify,
  uploadCitizenshipimages,
  citizenshipController
);

/**
 * @swagger
 * /api/auth-owner/adddocuments/nationalid:
 *   post:
 *     summary: Upload National ID Document
 *     description: Uploads national ID image for the owner.
 *     tags:
 *       - Owner
 *     security:
 *       - bearerAuth: []  # Assuming Bearer token authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/NationalIdUpload'
 *     responses:
 *       200:
 *         description: National ID image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: 'https://example.com/nationalid.jpg'
 *               message: "National ID image URL saved to Owner schema successfully"
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
 *               error: 'Internal Server Error'
 */

router.post(
  "/adddocuments/nationalid",
  verifyToken,
  ownersigninverify,
  uploadnationalID,
  nationalidController
);

/**
 * @swagger
 * /api/auth-owner/refreshtoken:
 *   post:
 *     summary: Refresh Access Token
 *     description: Refreshes the access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID of the owner for whom to refresh the token
 *             required:
 *               - _id
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             example:
 *               token: 'new_access_token_here'
 *       400:
 *         description: Invalid content
 *         content:
 *           application/json:
 *             example:
 *               error: 'Invalid content'
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
 *               error: 'Internal Server Error'
 */

router.post("/refreshtoken", refreshToken);

module.exports = router;
