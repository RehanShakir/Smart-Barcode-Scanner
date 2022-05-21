const express = require("express");
const { Router } = express;
const controller = require("../controllers/admin/admin.controller");
const {
  dashboardCounts,
  getAllUsers,
  statusUpdate,
  getScannedData,
  updateButtons,
  userScannedData,
} = controller;

const router = Router();

/**
 * Get Dashbord Counts
 */
router.get("/count", dashboardCounts);

/**
 * Get All Users
 */
router.get("/all-users", getAllUsers);
/**
 * Update User Status
 * @param {id}
 * @body {string} - Status
 */
router.patch("/update-status/:userId", statusUpdate);

/**
 * Get All Scanned Data
 */
router.get("/scanned-data", getScannedData);

/**
 * Update Buttons
 * @body
 * selectedButtonsByAdmin - array
 */
router.patch("/update-buttons/:id", updateButtons);

/**
 * Get Scanned Data by user _id
 * @params - {id}
 */
router.get("/user-scanned-data/:id", userScannedData);
module.exports = router;
