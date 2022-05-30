const mongoose = require("mongoose");
const { model, Schema, Types } = mongoose;

const insuranceSchema = new Schema(
  {
    scannerId: { type: Types.ObjectId, ref: "Scanner" },
    customerName: { type: String },
    address: { type: String },
    code: { type: String },
    productStatus: { type: String },
    packageContents: { type: String },
    sizeWeight: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    nameWebshop: { type: String },
  },
  { timestamps: true }
);
const Insurance = model("Insurance", insuranceSchema);
module.exports = Insurance;
