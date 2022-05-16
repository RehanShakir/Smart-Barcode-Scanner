const express = require("express");
const User = require("../../models/user.model");
const validator = require("../../validators/auth.validator");
const { Request, Response } = express;
const { UserExists, ValidateEmail } = validator;

/**
 * This Function allows User to login To his respective Dashboard based on Role [Admin, Client]
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req?.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(500)
        .json({ message: "User Not exists, please Signup First" });
    }
    if (!(await user?.comparePassword(password))) {
      return res.status(500).json({
        status: "Unauthorized",
        message: "Email/Password does not match",
      });
    }
    if (user.status === "pending" || user.status === "rejected") {
      return res.status(500).json({
        status: "Unauthorized",
        message: "Your Account is not approved yet.",
      });
    }
    res.status(200).json({
      message: "Logged In",
      token: user.getJwtToken(),
      role: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/**
 * Creates new instance of User in database
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

exports.userSignup = async (req, res) => {
  try {
    const { fullName, email, password } = req?.body;
    if (await UserExists(email)) {
      return res
        .status(500)
        .json({ message: `User already registered with this email ${email}` });
    }
    if (ValidateEmail(email) === false) {
      return res
        .status(500)
        .json({ message: "Please enter correct email address" });
    }
    const user = await User.create({
      fullName,
      email,
      password,
    });
    user.save();
    return res.status(200).json({ message: "User Signed Up Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get Users Profile from database
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
