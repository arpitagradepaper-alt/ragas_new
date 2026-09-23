const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    // Link candidate with User account.
    // Optional: chatbot leads and admin-created candidates have
    // no user account, so the unique index must be sparse.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      unique: true,
      sparse: true,
    },

    name: {
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
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    qualification: {
      type: String,
      trim: true,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: String,
      trim: true,
      default: "",
    },

    resume: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Shortlisted", "Placed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);