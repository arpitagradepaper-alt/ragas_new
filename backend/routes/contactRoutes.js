const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SUBMIT CONTACT FORM
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
      data: contact,
    });

  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});


// ==========================================
// GET ALL CONTACT SUBMISSIONS (ADMIN ONLY)
// ==========================================
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    console.error("Fetch contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch contacts.",
    });
  }
});


// ==========================================
// GET SINGLE CONTACT DETAILS (ADMIN ONLY)
// ==========================================
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID.",
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    res.json({
      success: true,
      data: contact,
    });

  } catch (error) {
    console.error("Fetch contact details error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch contact details.",
    });
  }
});


module.exports = router;