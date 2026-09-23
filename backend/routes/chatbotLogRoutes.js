const express = require("express");
const ChatbotLog = require("../models/ChatbotLog");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      user,
      userType,
      topic,
      status,
      messages,
    } = req.body || {};

    if (!conversationId || !user) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and user are required.",
      });
    }

    const existingConversation = await ChatbotLog.findOne({
      conversationId,
    });

    let conversation;

    if (existingConversation) {
      existingConversation.user = user;
      existingConversation.userType = userType || "Guest";
      existingConversation.topic = topic || "General Enquiry";
      existingConversation.status = status || "AI Resolved";
      existingConversation.messages = messages || [];

      conversation = await existingConversation.save();

      return res.status(200).json({
        success: true,
        message: "Chatbot conversation updated successfully!",
        data: conversation,
      });
    }

    conversation = await ChatbotLog.create({
      conversationId,
      user,
      userType: userType || "Guest",
      topic: topic || "General Enquiry",
      status: status || "AI Resolved",
      messages: messages || [],
    });

    res.status(201).json({
      success: true,
      message: "Chatbot conversation saved successfully!",
      data: conversation,
    });
  } catch (error) {
    console.error("Chatbot log error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save chatbot conversation.",
    });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const conversations = await ChatbotLog.find().sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Fetch chatbot logs error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch chatbot conversations.",
    });
  }
});

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const conversation = await ChatbotLog.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Fetch conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch conversation.",
    });
  }
});

module.exports = router;