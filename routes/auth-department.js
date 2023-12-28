const express = require("express");

const { departmentSignin } = require("../controllers/auth-department");
const router = express.Router();

router.post("department/signin", departmentSignin);

module.exports = router;
