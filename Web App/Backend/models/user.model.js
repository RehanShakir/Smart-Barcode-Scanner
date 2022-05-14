const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hash, compare } = bcrypt;
const { model, Schema } = mongoose;
const { sign } = jwt;

const userSchema = new Schema({
  fullName: { type: "String", required: [true, "Full Name is required"] },
  email: { type: "String", required: [true, "Email is required"] },
  password: {
    type: "String",
    required: [true, "A Password is required to Sign Up"],
  },
  role: {
    type: "String",
    default: "client",
    enum: ["client", "admin"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await hash(this.password, 10);
});

//Compare the passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

//Return JWT
userSchema.methods.getJwtToken = () => {
  return sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const user = model("User", userSchema);
module.exports = user;
