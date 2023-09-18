const express = require("express");

const { ownerById, read, update } = require("../controllers/owner");
const { requireSuperadminSignin } = require("../controllers/auth-owner");

const router = express.Router();

router.get("/:ownerId", requireSuperadminSignin, read);

router.param("ownerId", ownerById);
router.put("/:ownerId", requireSuperadminSignin, update);

module.exports = router;
