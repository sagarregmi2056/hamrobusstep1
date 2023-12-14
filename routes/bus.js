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

router.route("/").get(getBuses).post(requireOwnerSignin, create);

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
