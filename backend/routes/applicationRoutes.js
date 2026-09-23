const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Application = require("../models/Application");
const Job = require("../models/Job");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "applications"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;

    req.savedOriginalFileName = file.originalname;

    cb(null, uniqueName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension =
    path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed."
      )
    );
  }

  cb(null, true);
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================================
// CREATE APPLICATION
// =====================================================

router.post(
  "/",
  upload.single("resume"),
  async (req, res) => {
    try {
      const {
        jobId,
        jobTitle,
        fullName,
        email,
        phone,
        dateOfBirth,
        currentLocation,
        currentJobTitle,
        totalExperience,
        highestQualification,
        currentCompany,
        keySkills,
        preferredLocation,
        preferredCountry,
        expectedSalary,
        noticePeriod,
        coverLetter,
      } = req.body;

      let partnerId = null;
      let actualJobTitle = jobTitle;

      // =================================================
      // FIND JOB
      // =================================================

      if (
        jobId &&
        mongoose.Types.ObjectId.isValid(jobId)
      ) {
        const job = await Job.findById(jobId);

        if (job) {
          partnerId = job.partnerId || null;

          actualJobTitle =
            job.jobTitle || actualJobTitle;
        }
      }

      // =================================================
      // REQUIRED FIELDS
      // =================================================

      if (
        !jobId ||
        !jobTitle ||
        !fullName ||
        !email ||
        !phone
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Job, name, email and phone are required.",
        });
      }

      // =================================================
      // RESUME REQUIRED
      // =================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload your resume.",
        });
      }

      // =================================================
      // NORMALIZE EMAIL
      // =================================================

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      // =================================================
      // OPTIONAL USER LINK
      // =================================================

      let submittingUserId = null;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        try {
          const jwt = require("jsonwebtoken");

          const decoded = jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_SECRET
          );

          if (decoded && decoded.id) {
            submittingUserId = decoded.id;
          }
        } catch (tokenError) {
          submittingUserId = null;
        }
      }

      // =================================================
      // CREATE APPLICATION
      // =================================================

      const application =
        new Application({
          partnerId,

          jobId,

          user: submittingUserId || null,

          originalFileName:
            req.file.originalname,

          jobTitle:
            actualJobTitle,

          fullName,

          email:
            normalizedEmail,

          phone,

          dateOfBirth,

          currentLocation,

          currentJobTitle,

          totalExperience,

          highestQualification,

          currentCompany,

          keySkills,

          preferredLocation,

          preferredCountry,

          expectedSalary,

          noticePeriod,

          coverLetter,

          resumeFile:
            req.file.filename,

          status: "Applied",
        });

      await application.save();

      console.log("====================================");
      console.log("APPLICATION CREATED");
      console.log("Application ID:", application._id);
      console.log("Candidate:", application.email);
      console.log("Job:", application.jobTitle);
      console.log("Status:", application.status);
      console.log("====================================");

      return res.status(201).json({
        success: true,

        message:
          "Application submitted successfully.",

        data: application,
      });
    } catch (error) {
      console.error(
        "CREATE APPLICATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to submit application.",
      });
    }
  }
);

// =====================================================
// GET ALL APPLICATIONS - ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const applications =
        await Application.find()
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error(
        "GET APPLICATIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load applications.",
      });
    }
  }
);

// =====================================================
// GET APPLICATIONS FOR CURRENT CANDIDATE
// =====================================================

router.get(
  "/candidate",
  authMiddleware,
  async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,

          message:
            "Candidate email is required.",
        });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const loggedInEmail =
        String(req.user.email || "")
          .trim()
          .toLowerCase();

      // =================================================
      // OWNERSHIP CHECK
      // =================================================

      if (
        loggedInEmail !== normalizedEmail
      ) {
        return res.status(403).json({
          success: false,

          message:
            "You can only view your own applications.",
        });
      }

      // =================================================
      // FIND APPLICATIONS
      // =================================================

      const applications =
        await Application.find({
          email: normalizedEmail,
        }).sort({
          createdAt: -1,
        });

      // =================================================
      // DEBUG LOG
      // =================================================

      console.log("====================================");
      console.log("CANDIDATE APPLICATIONS");
      console.log("Email:", normalizedEmail);

      applications.forEach((application) => {
        console.log({
          id: String(application._id),
          jobTitle: application.jobTitle,
          status: application.status,
        });
      });

      console.log("====================================");

      return res.json({
        success: true,

        data: applications,
      });
    } catch (error) {
      console.error(
        "GET CANDIDATE APPLICATIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to load candidate applications.",

        error:
          error.stack || null,
      });
    }
  }
);

// =====================================================
// RESUME
// MUST COME BEFORE /:id
// =====================================================

router.get(
  "/resume/:filename",
  (req, res) => {
    try {
      const filename =
        path.basename(
          req.params.filename
        );

      const filePath =
        path.join(
          uploadDir,
          filename
        );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,

          message:
            "Resume file not found.",
        });
      }

      return res.sendFile(filePath);
    } catch (error) {
      console.error(
        "RESUME ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to open resume.",
      });
    }
  }
);

// =====================================================
// GET SINGLE APPLICATION - ADMIN ONLY
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const application =
        await Application.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,

          message:
            "Application not found.",
        });
      }

      return res.json({
        success: true,

        data: application,
      });
    } catch (error) {
      console.error(
        "GET SINGLE APPLICATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load application.",
      });
    }
  }
);

// =====================================================
// UPDATE APPLICATION STATUS - ADMIN ONLY
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body || {};

      console.log("");
      console.log("====================================");
      console.log("APPLICATION STATUS UPDATE");
      console.log("====================================");
      console.log("Application ID:", id);
      console.log("Received status:", status);
      console.log("Admin ID:", req.user?.id);
      console.log("Admin Email:", req.user?.email);
      console.log("====================================");

      // =================================================
      // VALIDATE APPLICATION ID
      // =================================================

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        console.log(
          "INVALID APPLICATION ID:",
          id
        );

        return res.status(400).json({
          success: false,

          message:
            "Invalid application ID.",
        });
      }

      // =================================================
      // ALLOWED STATUSES
      // =================================================

      const allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      // =================================================
      // STATUS REQUIRED
      // =================================================

      if (!status) {
        console.log(
          "STATUS WAS NOT PROVIDED"
        );

        return res.status(400).json({
          success: false,

          message:
            "Application status is required.",
        });
      }

      // =================================================
      // VALIDATE STATUS
      // =================================================

      if (
        !allowedStatuses.includes(status)
      ) {
        console.log(
          "INVALID STATUS RECEIVED:",
          status
        );

        return res.status(400).json({
          success: false,

          message:
            "Invalid application status.",

          allowedStatuses,
        });
      }

      // =================================================
      // FIND EXISTING APPLICATION
      // =================================================

      const existingApplication =
        await Application.findById(id);

      if (!existingApplication) {
        console.log(
          "APPLICATION NOT FOUND:",
          id
        );

        return res.status(404).json({
          success: false,

          message:
            "Application not found.",
        });
      }

      // =================================================
      // LOG OLD AND NEW STATUS
      // =================================================

      console.log("APPLICATION FOUND");
      console.log(
        "Candidate:",
        existingApplication.email
      );
      console.log(
        "Job:",
        existingApplication.jobTitle
      );
      console.log(
        "OLD STATUS:",
        existingApplication.status
      );
      console.log(
        "NEW STATUS:",
        status
      );

      // =================================================
      // UPDATE STATUS
      // =================================================

      existingApplication.status =
        status;

      await existingApplication.save();

      // =================================================
      // READ AGAIN FROM DATABASE
      // =================================================

      const updatedApplication =
        await Application.findById(id);

      console.log("");
      console.log("====================================");
      console.log("STATUS SAVED IN MONGODB");
      console.log("====================================");
      console.log(
        "Application ID:",
        updatedApplication._id
      );
      console.log(
        "Candidate:",
        updatedApplication.email
      );
      console.log(
        "Job:",
        updatedApplication.jobTitle
      );
      console.log(
        "SAVED STATUS:",
        updatedApplication.status
      );
      console.log("====================================");
      console.log("");

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        message:
          "Application status updated successfully.",

        data: updatedApplication,
      });
    } catch (error) {
      console.error("");
      console.error(
        "===================================="
      );
      console.error(
        "UPDATE APPLICATION STATUS ERROR"
      );
      console.error(
        "===================================="
      );
      console.error(error);
      console.error(
        "===================================="
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to update application status.",
      });
    }
  }
);

// =====================================================
// MULTER / ROUTE ERROR HANDLER
// =====================================================

router.use(
  (error, req, res, next) => {
    console.error(
      "APPLICATION ROUTE ERROR:",
      error
    );

    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Resume must be 10 MB or smaller.",
        });
      }

      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "Resume upload failed.",
      });
    }

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Application request failed.",
    });
  }
);

module.exports = router;