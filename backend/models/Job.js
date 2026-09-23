const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      default: null,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
    },

    openings: {
      type: Number,
      default: null,
    },

    skills: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      // Draft  : partner saved the job but the partner account is not verified
      //          yet. Never visible to admin or publicly.
      // Pending: submitted for admin approval.
      // Approved: live on the public website.
      enum: ["Draft", "Pending", "Approved", "Rejected", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);