const express = require("express");

const { departmentSignin } = require("../controllers/auth-department");
const router = express.Router();

router.post("/deparmentsignin", departmentSignin);

module.exports = router;
