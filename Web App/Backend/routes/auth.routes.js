const express = require("express");
const { Router } = express;
const controller = require("../controllers/auth/auth.controller");
const middleware = require("../middlewares/verifytoken");
const { userSignup, userLogin } = controller;
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

module.exports = router;
