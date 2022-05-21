// const express = require("express");
// const Insurance = require("../models/insurance.model");

// /**
//  * Post insurance
//  * @param {Request} req - request object
//  * @param {Response} res - response object
//  */
// exports.claimInsurance = async = (req, res) => {
//   try {
//       const {name,address,code,productStatus,website,sizeWeight,email,phoneNumber} = req?.body;
//       const insurance = await Insurance.create({
//         name,address,code,productStatus,website,sizeWeight,email,phoneNumber
//       });
//       insurance.save();
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
