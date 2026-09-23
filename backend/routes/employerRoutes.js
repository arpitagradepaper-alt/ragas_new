const express = require("express");
const mongoose = require("mongoose");
const Employer = require("../models/Employer");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================
// REGISTER EMPLOYER
// =========================================

router.post("/", async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      companyWebsite,
      companySize,
      location,
      hiringNeeds,
      message,
    } = req.body || {};

    if (!companyName || !contactPerson || !email || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, contact person, email and phone are required.",
      });
    }

    const employer = new Employer({
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      companyWebsite,
      companySize,
      location,
      hiringNeeds,
      message,
    });

    await employer.save();

    res.status(201).json({
      success: true,
      message: "Employer registered successfully!",
      data: employer,
    });
  } catch (error) {
    console.error("Employer registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});


// =========================================
// GET ALL EMPLOYERS (ADMIN ONLY)
// =========================================

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const employers = await Employer.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: employers,
    });
  } catch (error) {
    console.error("Fetch employers error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch employers.",
    });
  }
});


// =========================================
// GET SINGLE EMPLOYER (ADMIN ONLY)
// =========================================

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer ID.",
      });
    }

    const employer = await Employer.findById(id);

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }

    res.json({
      success: true,
      data: employer,
    });
  } catch (error) {
    console.error("Fetch employer details error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch employer details.",
    });
  }
});


module.exports = router;