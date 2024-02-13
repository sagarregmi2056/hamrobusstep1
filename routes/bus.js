const express = require("express");
const router = express.Router();
const {
  requireOwnerSignin,
  isPoster,
  requireownerkycverify,
} = require("../controllers/auth-owner");

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
  uploadinsideBusImagecontroller,
  getbusdroppingAndboarding,
  searchbusbyfare,
  BusInformation,
  AddRoutes,
  addBoardingPoint,
  addDroppingPoint,
  getbusBoardingPoints,
  getbusdroppingpoints,
  updateBoardingPoints,
  updateDroppingPoints,
  addSeatConfiguration,
  deleteSeatConfiguration,
  getAllSeatConfigurations,

  OwnerBusList,
  Generateuniqueid,
} = require("../controllers/bus");

const { uploadBusImage, uploadinsideBusImage } = require("../helpers");
const { imageValidator } = require("../validator");
/**
 * @swagger
 * /api/bus:
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
 * /api/bus:
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

router.get("/getlistofbus", requireownerkycverify, OwnerBusList);

router.post("/addboardingpoints/:id", requireownerkycverify, addBoardingPoint);

router.post("/adddroppingpoints/:id", requireownerkycverify, addDroppingPoint);

router.get(
  "/getdroppingboarding/:id",
  requireownerkycverify,
  getbusdroppingAndboarding
);

router.get(
  "/getboardingpoints/:id",
  requireownerkycverify,
  getbusBoardingPoints
);

router.get(
  "/getdroppingpoints/:id",
  requireownerkycverify,
  getbusdroppingpoints
);

router.put(
  "/updateboardingpoints/:id",
  requireownerkycverify,
  updateBoardingPoints
);

router.put(
  "/updatedroppingpoints/:id",
  requireownerkycverify,
  updateDroppingPoints
);

router.post(
  "/seatsconfiguration/seats/:id",
  requireownerkycverify,
  addSeatConfiguration
);

router.delete(
  "/seatconfig/:id/seats/:seatNumber",
  requireownerkycverify,
  deleteSeatConfiguration
);

router.get("/allseatsinfo/:id", getAllSeatConfigurations);

router.get("/generatebus", requireownerkycverify, Generateuniqueid);

router.post(
  "/uploadbusimage/:id",
  requireownerkycverify,
  uploadBusImage,
  uploadBusImageController
);
router.post("/businformation/:id", requireownerkycverify, BusInformation);

router.post("/addroutes/:id", requireownerkycverify, AddRoutes);

router.route("/").get(getBuses).post(requireownerkycverify, create);

/**
 * @swagger
 * /api/bus/uploadbusimage:
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

// not necessary
router.post(
  "/uploadbusinside",
  requireownerkycverify,
  uploadinsideBusImage,
  imageValidator,
  uploadinsideBusImagecontroller
);

/**
 * @swagger
 * /api/bus/owner-bus-available:
 *   get:
 *     summary: Get available buses of the owner
 *     description: Retrieve the list of available buses owned by the authenticated owner.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available buses retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus 1'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: true
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 20
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel: '60e7788cb535263a64a12520'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 slug: 'sample-bus-1'
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *               - _id: '60e778b1b535263a64a12523'
 *                 name: 'Sample Bus 2'
 *                 type: 'NONAC-SEATER'
 *                 busNumber: 'XYZ456'
 *                 fare: 800
 *                 isbusverified: true
 *                 description: 'An affordable bus for short trips'
 *                 seatsAvailable: 15
 *                 numberOfSeats: 20
 *                 departure_time: '10:00 AM'
 *                 travel: '60e7788cb535263a64a12520'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-05'
 *                 boardingPoints: ['Boarding Point 3', 'Boarding Point 4']
 *                 droppingPoints: ['Dropping Point 3', 'Dropping Point 4']
 *                 slug: 'sample-bus-2'
 *                 createdAt: '2022-07-08T13:45:30.678Z'
 *                 updatedAt: '2022-07-08T13:45:30.678Z'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.get(
  "/owner-bus-available",
  requireownerkycverify,
  getAvailableBusesOfOwner
);

/**
 * @swagger
 * /api/bus/owner-bus-unavailable:
 *   get:
 *     summary: Get unavailable buses of the owner
 *     description: Retrieve a list of buses that belong to the authenticated owner and are currently unavailable.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unavailable buses retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel: '60e7788cb535263a64a12520'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 slug: 'sample-bus'
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */
router.get(
  "/owner-bus-unavailable",
  requireownerkycverify,
  getUnavailableBusesOfOwner
);

/**
 * @swagger
 * /api/bus/all-bus-available:
 *   get:
 *     summary: Get all available buses
 *     description: Retrieve a list of all available buses in the system.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available buses
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel:
 *                   id: '60e7788cb535263a64a12520'
 *                   name: 'Travel Express'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 owner: { name: 'John Doe', phone: '123-456-7890' }
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *               - ... (more buses)
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.get("/all-bus-available", getAllAvailableBuses);

/**
 * @swagger
 * /api/bus/all-bus-unavailable:
 *   get:
 *     summary: Get all unavailable buses
 *     description: Retrieve a list of all unavailable buses in the system.
 *     tags:
 *       - Buses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unavailable buses
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel:
 *                   id: '60e7788cb535263a64a12520'
 *                   name: 'Travel Express'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 owner: { name: 'John Doe', phone: '123-456-7890' }
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *               - ... (more buses)
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.get("/all-bus-unavailable", getAllUnavailableBuses);

/**
 * @swagger
 * /api/bus/search:
 *   post:
 *     summary: Search for available buses
 *     description: Retrieve a list of available buses based on the search criteria.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: query
 *         name: startLocation
 *         required: true
 *         description: Start location ID for the bus journey
 *         schema:
 *           type: string
 *       - in: query
 *         name: endLocation
 *         required: true
 *         description: End location ID for the bus journey
 *         schema:
 *           type: string
 *       - in: query
 *         name: journeyDate
 *         required: true
 *         description: Journey date of the bus in the format YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available buses based on the search criteria
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel:
 *                   id: '60e7788cb535263a64a12520'
 *                   name: 'Travel Express'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *               - ... (more buses)
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.get("/search", searchBus);
/**
 * @swagger
 * /api/bus/filter:
 *   post:
 *     summary: Filter buses based on criteria
 *     description: Filter buses based on start location, end location, journey date, travel, and bus type.
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
 *               startLocation:
 *                 type: string
 *                 description: Start location ID
 *               endLocation:
 *                 type: string
 *                 description: End location ID
 *               journeyDate:
 *                 type: string
 *                 description: Journey date of the bus
 *               travel:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of travel IDs
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of bus types
 *     responses:
 *       200:
 *         description: Buses filtered successfully
 *         content:
 *           application/json:
 *             example:
 *               - _id: '60e778b1b535263a64a12522'
 *                 name: 'Sample Bus'
 *                 type: 'AC-SLEEPER'
 *                 busNumber: 'ABC123'
 *                 fare: 1000
 *                 isbusverified: false
 *                 description: 'A comfortable bus for your journey'
 *                 seatsAvailable: 30
 *                 numberOfSeats: 30
 *                 departure_time: '08:00 AM'
 *                 travel: '60e7788cb535263a64a12520'
 *                 startLocation: '60e77895b535263a64a12521'
 *                 endLocation: '60e77895b535263a64a12521'
 *                 journeyDate: '2022-08-01'
 *                 boardingPoints: ['Boarding Point 1', 'Boarding Point 2']
 *                 droppingPoints: ['Dropping Point 1', 'Dropping Point 2']
 *                 images: [
 *                   { type: 'front', url: 'https://example.com/front.jpg' },
 *                   { type: 'interior', url: 'https://example.com/interior.jpg' }
 *                 ]
 *                 slug: 'sample-bus'
 *                 createdAt: '2022-07-08T12:30:45.678Z'
 *                 updatedAt: '2022-07-08T12:30:45.678Z'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.post("/filter", searchBusByFilter);
router.post("/searchbusbyfare", searchbusbyfare);

/**
 * @swagger
 * /api/bus/{busSlug}:
 *   get:
 *     summary: Get bus details by slug
 *     description: Retrieve details of a specific bus using its slug.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: path
 *         name: busSlug
 *         required: true
 *         description: Slug of the bus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus details retrieved successfully
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
 *               images: [
 *                 { type: 'front', url: 'https://example.com/front.jpg' },
 *                 { type: 'interior', url: 'https://example.com/interior.jpg' }
 *               ]
 *               slug: 'sample-bus'
 *               createdAt: '2022-07-08T12:30:45.678Z'
 *               updatedAt: '2022-07-08T12:30:45.678Z'
 *       400:
 *         description: Bus not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Bus not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

/**
 * @swagger
 * /api/buses/{busSlug}:
 *   put:
 *     summary: Update bus details by slug
 *     description: Update details of a specific bus using its slug.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: path
 *         name: busSlug
 *         required: true
 *         description: Slug of the bus
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the bus
 *               type:
 *                 type: string
 *                 enum: [AC-SLEEPER, NONAC-SLEEPER, AC-SEATER, NONAC-SEATER]
 *                 description: New type of the bus
 *               busNumber:
 *                 type: string
 *                 description: New bus number
 *               fare:
 *                 type: number
 *                 description: New fare for the bus
 *               features:
 *                 type: array
 *                 description: New array of features
 *               description:
 *                 type: string
 *                 description: New description of the bus
 *               seatsAvailable:
 *                 type: number
 *                 description: New total seats available in the bus
 *               numberOfSeats:
 *                 type: number
 *                 description: New number of seats in the bus
 *               departure_time:
 *                 type: string
 *                 description: New departure time of the bus
 *               travel:
 *                 type: string
 *                 description: New travel ID
 *               startLocation:
 *                 type: string
 *                 description: New start location ID
 *               endLocation:
 *                 type: string
 *                 description: New end location ID
 *               journeyDate:
 *                 type: string
 *                 description: New journey date of the bus
 *               boardingPoints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New array of boarding points
 *               droppingPoints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New array of dropping points
 *     responses:
 *       200:
 *         description: Bus details updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: '60e778b1b535263a64a12522'
 *               name: 'Updated Bus'
 *               type: 'AC-SLEEPER'
 *               busNumber: 'ABC123'
 *               fare: 1200
 *               isbusverified: false
 *               description: 'An updated comfortable bus for your journey'
 *               seatsAvailable: 35
 *               numberOfSeats: 35
 *               departure_time: '09:00 AM'
 *               travel: '60e7788cb535263a64a12520'
 *               startLocation: '60e77895b535263a64a12521'
 *               endLocation: '60e77895b535263a64a12521'
 *               journeyDate: '2022-08-02'
 *               boardingPoints: ['Updated Boarding Point 1', 'Updated Boarding Point 2']
 *               droppingPoints: ['Updated Dropping Point 1', 'Updated Dropping Point 2']
 *               images: [
 *                 { type: 'front', url: 'https://example.com/front.jpg' },
 *                 { type: 'interior', url: 'https://example.com/interior.jpg' }
 *               ]
 *               slug: 'updated-bus'
 *               createdAt: '2022-07-08T12:30:45.678Z'
 *               updatedAt: '2022-07-08T14:45:30.987Z'
 *       400:
 *         description: Bus not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Bus not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router
  .route("/:busSlug")
  .get(read)
  .put(requireownerkycverify, isPoster, update)
  .delete(requireownerkycverify, isPoster, remove);

router.param("busSlug", busBySlug);

module.exports = router;
