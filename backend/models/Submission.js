const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    qrCode: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    qrLabel: {
      type: String,
      required: true,
      trim: true
    },
    redirectUrl: {
      type: String,
      required: true,
      trim: true
    },
    ipAddress: {
      type: String,
      default: ""
    },
    userAgent: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
