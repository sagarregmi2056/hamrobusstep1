const express = require("express");
const { requireUserSignin } = require("../controllers/auth-user");
const {
  postQueryUserToBus,
  busBySlug,
  getQueriesForBus,
} = require("../controllers/Query");
const { requireOwnerSignin } = require("../controllers/auth-owner");
const router = express.Router();

router.post("/querytobus/:busSlug", requireUserSignin, postQueryUserToBus);

router.get("/querybyuser/:busSlug", requireOwnerSignin, getQueriesForBus);

router.param("busSlug", busBySlug);

module.exports = router;
