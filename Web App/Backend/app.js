const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/routes");

// === Improved Security ===
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// === DB Connection ===

const database = require("./config/database");

// ==== Parse Application ====
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// === CORS Enabled ===
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

// === import Routes here ===

// Running API Routes
app.use("/api", apiRouter);

// === Enabling file uplod
app.use(fileupload());

// === Adding Secuirty ===

app.use(mongoSanitize());
app.use(xss());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// === Connecting the DB ===
database.connect();

// === Initiate Routes Here ===

module.exports = app;
