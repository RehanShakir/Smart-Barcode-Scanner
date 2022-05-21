const express = require("express");
const { Router } = express;
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const scannerRoutes = require("./scanner.routes");
const role = require("../middlewares/roles.middleware");
const auth = require("../middlewares/auth.middleware");

const router = Router();

router.use("/auth", authRoutes);

router.use("/admin", auth.userAuth, role.isAdmin, adminRoutes);

router.use("/barcode", auth.userAuth, scannerRoutes);

module.exports = router;
