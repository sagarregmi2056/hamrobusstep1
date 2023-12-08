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
  getTravels,
  travelById,
} = require("../controllers/travel");

router.route("/").get(getTravels).post(requireOwnerSignin, add);

router
  .route("/:id")
  .get(requireOwnerSignin, read)
  .put(requireOwnerSignin, update)
  .delete(requireOwnerSignin, remove);

router.param("id", travelById);

module.exports = router;
