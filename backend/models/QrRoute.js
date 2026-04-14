const mongoose = require("mongoose");

const qrRouteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    redirectUrl: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrRoute", qrRouteSchema);
