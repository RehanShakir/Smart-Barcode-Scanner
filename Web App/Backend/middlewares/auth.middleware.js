const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { NextFunction, Request, Response } = express;
const { verify } = jwt;

/**
 * Validates logged in User
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */

exports.userAuth = async (req, res, next) => {
  try {
    const token =
      req.headers["x-access-token"] ||
      req?.headers?.authorization?.split(" ")[1];

    // console.log(token);

    if (!token || token === "null") {
      return res.status(500).json("Login first to access the resource.");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decode.id });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Token expired, please generate new one" });
    }
    req.user = await User.findById(decode.id);
  } catch (error) {
    return res.status(400).json({
      message: "There is a problem with your token, please login again",
      error: error.message,
    });
  }
  next();
};
