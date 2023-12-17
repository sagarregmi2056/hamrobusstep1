const router = require("express").Router();

const {
  bookingById,
  getOwnerBookings,
  changeVerificationStatus,
  postBooking,
  postSold,
  deleteBooking,
  getAllBookings,
} = require("../controllers/booking");

const { checkUserSignin } = require("../controllers/auth-user");
const {
  requireOwnerSignin,
  isBookingOwner,
  requireSuperadminSignin,
} = require("../controllers/auth-owner");
const { busBySlug } = require("../controllers/bus");
// this is for owner with their own bookings
router.get("/my", requireOwnerSignin, getOwnerBookings);

// this is for admin to get all bookings
router.get("/all", requireSuperadminSignin, getAllBookings);
// owner afai ley bechna lai

router.post("/sold/:busSlug", requireOwnerSignin, postSold);

// user ley book garna lai
router.post("/book/:busSlug", checkUserSignin, postBooking);

router.patch("/:bookingId", requireOwnerSignin, changeVerificationStatus);

router.delete("/:bookingId", requireOwnerSignin, isBookingOwner, deleteBooking);

router.param("busSlug", busBySlug);
router.param("bookingId", bookingById);

module.exports = router;
