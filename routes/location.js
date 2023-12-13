const router = require("express").Router();
const { requireSuperadminSignin } = require("../controllers/auth-owner");
const {
  add,
  update,
  read,
  remove,
  getLocations,
  locationById,
} = require("../controllers/location");

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Add Location
 *     description: Add a new location.
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
 *                 description: Name of the location.
 *               district:
 *                 type: string
 *                 description: District of the location.
 *             required:
 *               - name
 *               - district
 *     responses:
 *       201:
 *         description: Location added successfully
 *         content:
 *           application/json:
 *             example:
 *               location: { _id: 'new_location_id', name: 'Gongabu', district: 'Kathmandu' }
 *       401:
 *         description: Unauthorized - Superadmin signin required
 *         content:
 *           application/json:
 *             example:
 *               error: 'Unauthorized'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get Locations
 *     description: Retrieve a list of all locations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               locations: [{ _id: 'location_id_1', name: 'Location 1', district: 'District 1' }, { _id: 'location_id_2', name: 'Location 2', district: 'District 2' }]
 *       401:
 *         description: Unauthorized - Superadmin signin required
 *         content:
 *           application/json:
 *             example:
 *               error: 'Unauthorized'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router.route("/").get(getLocations).post(requireSuperadminSignin, add);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get Location by ID
 *     description: Retrieve details of a location by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the location
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               name: "Gongabu"
 *               district: "Kathmandu"
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Location not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

/**
 * @swagger
 * /api/locations/{id}:
 *   put:
 *     summary: Update Location by ID
 *     description: Update details of a location by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the location
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
 *               name:
 *                 type: string
 *               district:
 *                 type: string
 *             example:
 *               name: "Updated Gongabu"
 *               district: "Updated Kathmandu"
 *     responses:
 *       200:
 *         description: Location details updated successfully
 *         content:
 *           application/json:
 *             example:
 *               name: "Updated Gongabu"
 *               district: "Updated Kathmandu"
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               error: 'Location not found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: 'Internal Server Error'
 */

router
  .route("/:id")
  .get(requireSuperadminSignin, read)
  .put(requireSuperadminSignin, update)
  .delete(requireSuperadminSignin, remove);

router.param("id", locationById);

module.exports = router;
