const mongoose = require("mongoose");
const { model, Schema, Types } = mongoose;

const scannerSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    barcode: { type: String },
    buttons: [{ type: String }],
    name: { type: String },
    address: { type: String },
    code: { type: String },
    productStatus: { type: String },
    website: { type: String },
    sizeWeight: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);
const Scanner = model("Scanner", scannerSchema);
module.exports = Scanner;
