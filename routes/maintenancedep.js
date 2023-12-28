const express = require("express");
const {
  requiremaintenceaccount,
} = require("../controllers/auth-department.js");

const router = express.Router();

const {
  updateOwnerStatus,
  approveOwner,
  rejectOwner,
  getOwnerDetails,
  getAllDocuments,
  getPendingSuccessDocuments,
} = require("../controllers/admin.js");
