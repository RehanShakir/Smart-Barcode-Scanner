const mongoose = require("mongoose");
const { model, Schema, Types } = mongoose;

const insuranceSchema = new Schema(
  {
    scannerId: { type: Types.ObjectId, ref: "Scanner" },
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
const Insurance = model("Insurance", insuranceSchema);
module.exports = Insurance;
