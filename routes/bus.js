const express = require("express");
const router = express.Router();
const { requireOwnerSignin, isPoster } = require("../controllers/auth-owner");

const {
  read,
  create,
  update,
  remove,
  busBySlug,
  getBuses,
  searchBus,
  searchBusByFilter,
  getAvailableBusesOfOwner,
  getUnavailableBusesOfOwner,
  getAllAvailableBuses,
  getAllUnavailableBuses,
  uploadBusImageController,
} = require("../controllers/bus");

const { uploadBusImage } = require("../helpers");
/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Create a new bus
 *     description: Create a new bus and add it to the system.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the bus
 *               type:
 *                 type: string
 *                 enum: [AC-SLEEPER, NONAC-SLEEPER, AC-SEATER, NONAC-SEATER]
 *                 default: NORMAL
 *                 description: Type of the bus
 *               busNumber:
 *                 type: string
 *                 description: Bus number
 *               fare:
 *                 type: number
 *                 description: Fare for the bus
 *               features:
 *                 type: array
 *                 description: Array of features
 *               isbusverified:
 *                 type: boolean
 *                 default: false
 *                 description: Indicates if the bus is verified
 *               description:
 *                 type: string
 *                 maxlength: 2000
 *                 description: Description of the bus
 *               seatsAvailable:
 *                 type: number
 *                 default: 30
 *                 description: Total seats available in the bus
 *               numberOfSeats:
 *                 type: number
 *                 default: 30
 *                 description: Number of seats in the bus
 *               departure_time:
 *                 type: string
 *                 description: Departure time of the bus
 *               travel:
 *                 type: string
 *                 description: Travel ID
 *               startLocation:
 *                 type: string
 *                 description: Start location ID
 *               endLocation:
 *                 type: string
 *                 description: End location ID
 *               journeyDate:
 *                 type: string
 *                 description: Journey date of the bus
 *               boardingPoints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of boarding points
 *               droppingPoints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of dropping points
 *     responses:
 *       200:
 *         description: Bus created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: '60e778b1b535263a64a12522'
 *               name: 'Sample Bus'
 *               type: 'AC-SLEEPER'
 *               busNumber: 'ABC123'
 *               fare: 1000
 *               isbusverified: false
 *               description: 'A comfortable bus for your journey'
 *               seatsAvailable: 30
 *               numberOfSeats: 30
 *               departure_time: '08:00 AM'
 *               travel: '60e7788cb535263a64a12520'
 *               startLocation: '60e77895b535263a64a12521'
 *               endLocation: '60e77895b535263a64a12521'
 *               journeyDate: '2022-08-01'
 *               boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *               droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *               slug: 'sample-bus'
 *               createdAt: '2022-07-08T12:30:45.678Z'
 *               updatedAt: '2022-07-08T12:30:45.678Z'
 *       400:
 *         description: Invalid boarding format
 *         content:
 *           application/json:
 *             example:
 *               error: 'Invalid boarding format'
 *       403:
 *         description: Bus is already added
 *         content:
 *           application/json:
 *             example:
 *               error: 'Bus is already added!'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     description: Retrieve a list of all buses in the system.
 *     tags:
 *       - Buses
 *     responses:
 *       200:
 *         description: List of buses retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus 1'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel: { _id: '60e7788cb535263a64a12520', name: 'Travel Company' }
 *                 startLocation: { _id: '60e77895b535263a64a12521', name: 'Start Location' }
 *                 endLocation: { _id: '60e77895b535263a64a12521', name: 'End Location' }
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 slug: 'sample-bus-1'
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *                 owner: { _id: '60e77895b535263a64a12521', name: 'Bus Owner' }
 *               - _id: '60e778b1b535263a64a12523'
 *                 name: 'Sample Bus 2'
 *                 type: 'NONAC-SLEEPER'
 *                 busNumber: 'XYZ456'
 *                 fare: 800
 *                 isbusverified: true
 *                 description: 'An economical bus for short distances'
 *                 seatsAvailable: 25
 *                 numberOfSeats: 25
 *                 departure_time: '10:00 AM'
 *                 travel: { _id: '60e7788cb535263a64a12522', name: 'Another Travel' }
 *                 startLocation: { _id: '60e77895b535263a64a12522', name: 'Another Start Location' }
 *                 endLocation: { _id: '60e77895b535263a64a12522', name: 'Another End Location' }
 *                 journeyDate: '2022-08-02'
 *                 boardingPoints: ['Boarding Point A', 'Boarding Point B']
 *                 droppingPoints: ['Dropping Point X', 'Dropping Point Y']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front2.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior2.jpg' }
 *                 ]
 *                 slug: 'sample-bus-2'
 *                 createdAt: '2022-07-09T09:45:30.123Z'
 *                 updatedAt: '2022-07-09T09:45:30.123Z'
 *                 owner: { _id: '60e77895b535263a64a12522', name: 'Another Bus Owner' }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.route("/").get(getBuses).post(requireOwnerSignin, create);

/**
 * @swagger
 * /api/uploadbusimage:
 *   post:
 *     summary: Upload Bus Image
 *     description: Uploads an image for the bus associated with the authenticated owner.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               busImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Bus image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               url: 'https://example.com/busimage.jpg'
 *               message: 'Bus image URL saved to Bus schema successfully'
 *       400:
 *         description: Invalid request or image format
 *         content:
 *           application/json:
 *             example:
 *               error: 'Invalid request or image format'
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
  "/uploadbusimage",
  requireOwnerSignin,
  uploadBusImage,
  uploadBusImageController
);

router.get(
  "/owner-bus-available",
  requireOwnerSignin,
  getAvailableBusesOfOwner
);
router.get(
  "/owner-bus-unavailable",
  requireOwnerSignin,
  getUnavailableBusesOfOwner
);

router.get("/all-bus-available", getAllAvailableBuses);
router.get("/all-bus-unavailable", getAllUnavailableBuses);

router.get("/search", searchBus);
router.post("/filter", searchBusByFilter);

router
  .route("/:busSlug")
  .get(read)
  .put(requireOwnerSignin, uploadBusImage, isPoster, update)
  .delete(requireOwnerSignin, isPoster, remove);

router.param("busSlug", busBySlug);

module.exports = router;
