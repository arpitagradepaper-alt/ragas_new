const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    preferredIndustry: {
      type: String,
      trim: true,
    },

    preferredCountry: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
    },

    currentLocation: {
      type: String,
      trim: true,
    },

    skills: {
      type: String,
      trim: true,
    },

    resumeFile: {
      type: String,
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);