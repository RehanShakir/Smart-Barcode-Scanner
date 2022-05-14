const express = require("express");
const { Router } = express;
const authRoutes = require("./auth.routes");

const router = Router();

router.use("/auth", authRoutes);

module.exports = router;
