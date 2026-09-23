const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Resume = require("../models/Resume");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// UPLOAD FOLDER
// ==========================================

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      console.log("Upload folder:", uploadDir);

      cb(null, uploadDir);
    } catch (error) {
      console.error("Upload folder error:", error);
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, uniqueName + extension);
  },
});

// ==========================================
// FILE FILTER
// ==========================================

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, DOC and DOCX files are allowed."
        )
      );
    }
  },
});

// ==========================================
// POST - UPLOAD RESUME
// ==========================================

router.post(
  "/",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("Resume upload request received");

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume.",
        });
      }

      console.log(
        "Resume saved successfully:",
        req.file.filename
      );

      const {
        name,
        email,
        phone,
        preferredIndustry,
        preferredCountry,
        experience,
        currentLocation,
        skills,
      } = req.body;

      // Required fields
      if (!name || !email) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (error) => {
            if (error) {
              console.error(
                "File delete error:",
                error
              );
            }
          });
        }

        return res.status(400).json({
          success: false,
          message: "Name and email are required.",
        });
      }

      // ==========================================
      // SAVE RESUME DATA TO MONGODB
      // ==========================================

      const resume = new Resume({
        name,
        email,
        phone,
        preferredIndustry,
        preferredCountry,
        experience,
        currentLocation,
        skills,

        resumeFile: req.file.filename,
        originalFileName: req.file.originalname,
      });

      await resume.save();

      console.log(
        "Resume data saved to MongoDB:",
        resume._id
      );

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      res.status(201).json({
        success: true,
        message: "Resume uploaded successfully!",
        data: resume,
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Resume upload failed.",
      });
    }
  }
);

// ==========================================
// GET - ALL RESUMES
// ==========================================

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error(
      "Fetch resumes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch resumes.",
    });
  }
});

// ==========================================
// GET - SINGLE RESUME DETAILS
// ==========================================

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID.",
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error(
      "Fetch resume details error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch resume details.",
    });
  }
});

// ==========================================
// GET - RESUME FILE
// ==========================================

router.get("/file/:filename", (req, res) => {
  try {
    const filename = req.params.filename;

    const filePath = path.join(
      uploadDir,
      filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found.",
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error(
      "Resume file error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to open resume file.",
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;