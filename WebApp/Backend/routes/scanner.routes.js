const express = require("express");
const { Router } = express;
const controller = require("../controllers/scanner.controller");
const multer = require("multer");
const {
  scan,
  getData,
  scannedBarcodesCount,
  claimInsurance,
  uploadPhotos,
  removePhoto,
  removeInsurance,
} = controller;
const router = Router();
const upload = multer({ dest: "upload/" });

/**
 * Save Scanned Data
 * @param {String} barcode
 * @param {String - Array} buttons
 */
router.post("/scan", scan);

/**
 * Get Scanned Data of Logged In User
 */
router.get("/data", getData);

/**
 * Get No of Scanned Barcodes of Logged In User
 */
router.get("/count", scannedBarcodesCount);
/**
 * Post Insurance
 * @body {String}
 * - name
 * - email
 * - phoneNumber
 * - address
 * - code
 * - productStatus
 * - sizeWeight
 */
router.post("/claim/:id", claimInsurance);

/**
 * Get Scanned Data of Logged In User
 * @body {files}
 */
router.patch("/upload/:id", upload.array("photos"), uploadPhotos);

/**
 * remove Photo
 * @param {string} id
 * @body {files}
 */
router.patch("/remove/:id", removePhoto);

/**
 * remove Insurane
 * @param {string} id
 * @body {files}
 */
router.patch("/remove-insurance/:id", removeInsurance);

module.exports = router;
