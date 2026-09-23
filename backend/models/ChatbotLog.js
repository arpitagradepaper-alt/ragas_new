const mongoose = require("mongoose");

const chatbotLogSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    user: {
      type: String,
      required: true,
      trim: true,
    },

    userType: {
      type: String,
      enum: ["Candidate", "Employer", "Guest"],
      default: "Guest",
    },

    topic: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["AI Resolved", "Live Agent"],
      default: "AI Resolved",
    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["User", "AI", "Agent"],
        },
        message: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatbotLog", chatbotLogSchema);