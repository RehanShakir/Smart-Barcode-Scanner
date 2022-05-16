const express = require("express");
const { Router } = express;
const controller = require("../controllers/scanner.controller");
const { scan, getData } = controller;
const router = Router();

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

module.exports = router;
