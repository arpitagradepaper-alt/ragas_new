const express = require("express");
const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE CANDIDATE
// Public for chatbot leads (userId optional) - duplicate
// profiles are matched by email so repeat chatbot leads
// do not create new records.
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      location,
      qualification,
      experience,
      skills,
    } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required.",
      });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ------------------------------------------------
    // Prevent duplicate candidate profiles (by email)
    // ------------------------------------------------

    const existingCandidate = await Candidate.findOne({
      email: cleanEmail,
    });

    if (existingCandidate) {
      return res.status(200).json({
        success: true,
        message: "Candidate profile already exists.",
        data: existingCandidate,
      });
    }

    const candidate = await Candidate.create({
      userId: userId || null,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      location: location || "",
      qualification: qualification || "",
      experience: experience || "",
      skills: skills || "",
    });

    return res.status(201).json({
      success: true,
      message: "Candidate profile created successfully.",
      data: candidate,
    });
  } catch (error) {
    console.error("Candidate creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// =====================================================
// GET ALL CANDIDATES (ADMIN ONLY)
// =====================================================

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const candidates = await Candidate.find({})
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error("Fetch candidates error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch candidates.",
    });
  }
});

// =====================================================
// GET SINGLE CANDIDATE (ADMIN ONLY)
// =====================================================

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error("Fetch candidate details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch candidate details.",
    });
  }
});

// =====================================================
// UPDATE CANDIDATE PROFILE (ADMIN ONLY)
// =====================================================

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "location",
      "qualification",
      "experience",
      "skills",
      "resume",
      "status",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully.",
      data: candidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update candidate.",
    });
  }
});

module.exports = router;