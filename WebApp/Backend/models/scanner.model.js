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
    barcode: { type: String },
    packageContents: { type: String },
    productStatus: { type: String, enum: ["lost", "damaged"] },
    website: { type: String },
    sizeWeight: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    productPhotos: [{ type: String }],
    claim: { type: String, default: false },
    claimStatus: {
      type: String,
      emum: ["inProgress", "finished", "flagged"],
      default: "inProgress",
    },
    deleteButtonFlag: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Scanner = model("Scanner", scannerSchema);
module.exports = Scanner;
