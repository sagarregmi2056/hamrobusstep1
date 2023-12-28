const express = require("express");
const { addDepartmentaccount } = require("../controllers/department");
const router = express.Router();

router.post("/adddepartmentaccount", addDepartmentaccount);

module.exports = router;
