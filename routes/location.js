const router = require("express").Router();
const {
  requireSuperadminSignin,
  requireOwnerSignin,
} = require("../controllers/auth-owner");
const {
  add,
  update,
  read,
  remove,
  getLocations,
  locationById,
} = require("../controllers/location");

router.route("/").get(getLocations).post(requireOwnerSignin, add);

router
  .route("/:id")
  .get(requireOwnerSignin, read)
  .put(requireOwnerSignin, update)
  .delete(requireOwnerSignin, remove);

router.param("id", locationById);

module.exports = router;
