const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      default: null,
      index: true,
    },

    jobId: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
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

    dateOfBirth: {
      type: String,
      trim: true,
    },

    currentLocation: {
      type: String,
      trim: true,
    },

    currentJobTitle: {
      type: String,
      trim: true,
    },

    totalExperience: {
      type: String,
      trim: true,
    },

    highestQualification: {
      type: String,
      trim: true,
    },

    currentCompany: {
      type: String,
      trim: true,
    },

    keySkills: {
      type: String,
      trim: true,
    },

    preferredLocation: {
      type: String,
      trim: true,
    },

    preferredCountry: {
      type: String,
      trim: true,
    },

    expectedSalary: {
      type: String,
      trim: true,
    },

    noticePeriod: {
      type: String,
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    resumeFile: {
      type: String,
      default: null,
    },

    originalFileName: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);