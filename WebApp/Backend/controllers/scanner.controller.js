const express = require("express");
const Scanner = require("../models/scanner.model");
const multer = require("../libraries/multer.js");
const util = require("util");
const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = util;

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
    const scannedData = await Scanner.find({ userId: req.user._id }).populate({
      path: "userId",
      select: "-password",
    });

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

/**
 * Post insurance
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.claimInsurance = async (req, res) => {
  try {
    const {
      name,
      address,
      code,
      productStatus,
      website,
      sizeWeight,
      email,
      phoneNumber,
      packageContents,
      barcode,
      buttons,
    } = req?.body;
    const insurance = await Scanner.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name,
        address,
        code,
        productStatus,
        website,
        sizeWeight,
        email,
        phoneNumber,
        packageContents,
        buttons,
        claim: true,
      },
      { upsert: true, new: true }
    );
    setTimeout(async () => {
      await Scanner.findByIdAndUpdate(
        { _id: req.params.id },
        { deleteButtonFlag: true } //Run After 8 Hours
      );
    }, 1000 * 3600 * 8);
    return res.status(200).json({ insurance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Upload Claim Photos
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.uploadPhotos = async (req, res) => {
  try {
    const unlinkFile = promisify(fs.unlink);

    const photosObj = req?.files;
    let photos = [];
    for (let i = 0; i < photosObj.length; i++) {
      const result = await multer.uploadPhoto(photosObj[i]);
      photos.push(result.Location);
      await unlinkFile(photosObj[i].path);
    }

    await Scanner.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { productPhotos: photos },
      }
    );
    return res.status(200).json({ message: "Photo Uplaoded Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Remove Claim Photos
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.removePhoto = async (req, res) => {
  try {
    const photo = req.body.photo;
    await Scanner.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { productPhotos: photo },
      }
    );
    return res.status(200).json({ message: "Photo Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeInsurance = async (req, res) => {
  try {
    const insurance = req.body.insurance;
    await Scanner.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { buttons: insurance },
      }
    );
    return res.status(200).json({ message: "Insurance Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteInusrance = async (req, res) => {
  try {
    await Scanner.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Barcode Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
