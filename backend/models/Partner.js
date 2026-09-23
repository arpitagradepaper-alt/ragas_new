const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    // Company Details
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    partnerType: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    // Address
    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    specialization: {
      type: String,
      trim: true,
    },

    geography: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    // Registration Details
    yearsInOperation: {
      type: String,
      trim: true,
    },

    registrationNumber: {
      type: String,
      trim: true,
    },

    registrationCertificate: {
      type: String,
      trim: true,
    },

    // Partner Approval
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    // Partner Login
    passwordHash: {
      type: String,
      default: null,
    },

    accountCreated: {
      type: Boolean,
      default: false,
    },

    accountCreatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Partner", partnerSchema);