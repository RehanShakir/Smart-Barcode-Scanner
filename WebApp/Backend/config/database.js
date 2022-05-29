const mongoose = require("mongoose");

const options =
  (process.env.NODE_ENV === "development" && {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) ||
  (process.env.NODE_ENV === "production" && {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
exports.connect = () => {
  mongoose
    .connect(process.env.DatabaseURL, options)
    .then(() => {
      console.log("Database Access Granted");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
