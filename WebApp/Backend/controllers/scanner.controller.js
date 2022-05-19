const express = require("express");
const Scanner = require("../models/scanner.model");

/**
 * Creates new document of scanned barcode data in database.
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

exports.scan = async (req, res) => {
  try {
    const { barcode, buttons } = req?.body;
    const scanner = await Scanner.create({
      userId: req.user._id,
      barcode,
      buttons,
    });
    scanner.save();
    return res.status(200).json({ message: "Barcode scanned successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get Scanned Data of Logged In User
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.getData = async (req, res) => {
  try {
    const scannedData = await Scanner.find({ userId: req.user._id });

    return res.status(200).json({ scannedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/**
 * Get Total Scanned Barcodes of Logged In User
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.scannedBarcodesCount = async (req, res) => {
  try {
    const count = await Scanner.countDocuments({ userId: req.user._id });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
