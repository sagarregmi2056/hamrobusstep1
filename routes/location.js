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
 * /api/locations/:
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
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Location added successfully
 *         content:
 *           application/json:
 *             example:
 *               location: { _id: 'new_location_id', name: 'New Location', district: 'New District' }
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

router
  .route("/:id")
  .get(requireSuperadminSignin, read)
  .put(requireSuperadminSignin, update)
  .delete(requireSuperadminSignin, remove);

router.param("id", locationById);

module.exports = router;
