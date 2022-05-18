const express = require("express");
const { Router } = express;
const controller = require("../controllers/auth/auth.controller");
const middleware = require("../middlewares/auth.middleware");
const { userSignup, userLogin, myProfile, updateProfile } = controller;
const { userAuth } = middleware;

const router = Router();

/**
 * SignUp User
 * @body
 * fullName
 * email
 * password
 */
router.post("/signup", userSignup);

/**
 * Login User
 * @body
 * email
 * password
 */
router.post("/login", userLogin);

/**
 * Get User Profile
 */
router.get("/my-profile", userAuth, myProfile);

/**
 * Update User Profile
 * @body
 * email
 * oldPassword
 * newPassword
 */
router.patch("/update-profile", userAuth, updateProfile);

module.exports = router;
