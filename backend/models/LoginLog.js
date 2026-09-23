const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "partner"],
    },

    collectionName: {
      type: String,
      required: true,
      enum: ["users", "admins", "partners"],
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LoginLog", loginLogSchema, "logins");
