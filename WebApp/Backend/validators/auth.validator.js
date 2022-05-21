const validator = require("validator");
const User = require("../models/user.model");

exports.UserExists = async (email) => {
  User.exists({ email: email });
};

exports.ValidateEmail = (email) => {
  validator.isEmail(email);
};
