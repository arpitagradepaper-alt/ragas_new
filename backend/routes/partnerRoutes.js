const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Partner = require("../models/Partner");
const Job = require("../models/Job");
const Application = require("../models/Application");

const {
  authMiddleware,
  adminMiddleware,
  partnerMiddleware,
  verifiedPartnerMiddleware,
} = require("../middleware/authMiddleware");

const { sendPartnerApprovalEmail } = require("../services/mailer");

const router = express.Router();

/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "partners"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================================================
   MULTER
========================================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

/* =========================================================
   GENERATE TEMPORARY PASSWORD
========================================================= */

function generateTemporaryPassword() {
  return crypto.randomBytes(6).toString("base64url") + "@R";
}

/* =========================================================
   PARTNER REGISTRATION
   PUBLIC
========================================================= */

router.post(
  "/",
  upload.single("registrationCertificate"),
  async (req, res) => {
    try {
      const {
        companyName,
        partnerType,
        contactPerson,
        email,
        password,
        specialization,
        geography,
        phone,
        message,
        yearsInOperation,
        registrationNumber,
      } = req.body;

      /* -----------------------------------------
         REQUIRED FIELDS
      ----------------------------------------- */

      if (
        !companyName ||
        !partnerType ||
        !contactPerson ||
        !email
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Company name, partner type, contact person and email are required.",
        });
      }

      /* -----------------------------------------
         PASSWORD VALIDATION
      ----------------------------------------- */

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required.",
        });
      }

      if (String(password).length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      /* -----------------------------------------
         CHECK EXISTING PARTNER
      ----------------------------------------- */

      const existingPartner = await Partner.findOne({
        email: normalizedEmail,
      });

      if (existingPartner) {
        return res.status(409).json({
          success: false,
          message:
            "A partner registration with this email already exists.",
        });
      }

      /* -----------------------------------------
         REGISTRATION CERTIFICATE
      ----------------------------------------- */

      const registrationCertificate = req.file
        ? req.file.path
        : null;

      /* -----------------------------------------
         HASH PASSWORD
      ----------------------------------------- */

      const passwordHash = await bcrypt.hash(
        String(password),
        12
      );

      /* -----------------------------------------
         CREATE PARTNER
      ----------------------------------------- */

      const partner = await Partner.create({
        companyName: companyName.trim(),
        partnerType: partnerType.trim(),
        contactPerson: contactPerson.trim(),
        email: normalizedEmail,

        specialization:
          specialization?.trim() || "",

        geography:
          geography?.trim() || "",

        phone:
          phone?.trim() || "",

        message:
          message?.trim() || "",

        yearsInOperation:
          yearsInOperation?.trim() || "",

        registrationNumber:
          registrationNumber?.trim() || "",

        registrationCertificate,

        status: "Pending",

        passwordHash,

        accountCreated: true,

        accountCreatedAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message:
          "Partner registration submitted successfully. You can now log in with your email and password.",
        partner,
      });
    } catch (error) {
      console.error(
        "Partner registration error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to submit partner registration.",
      });
    }
  }
);

/* =========================================================
   GET ALL PARTNERS
   ADMIN ONLY
========================================================= */

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const partners = await Partner.find().sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        partners,
      });
    } catch (error) {
      console.error(
        "Get partners error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch partners.",
      });
    }
  }
);

/* =========================================================
   PARTNER DASHBOARD
   PARTNER ONLY
========================================================= */

router.get(
  "/dashboard",
  authMiddleware,
  async (req, res) => {
    try {
      if (
        !req.user ||
        req.user.role !== "partner"
      ) {
        return res.status(403).json({
          success: false,
          message: "Partner access required.",
        });
      }

      const partnerId = String(
        req.user.id ||
          req.user._id ||
          ""
      );

      if (!partnerId) {
        return res.status(401).json({
          success: false,
          message: "Partner identity missing.",
        });
      }

      const [
        jobs,
        applications,
        partner,
      ] = await Promise.all([
        Job.find({ partnerId }).sort({
          createdAt: -1,
        }),

        Application.find({
          partnerId,
        }).sort({
          createdAt: -1,
        }),

        Partner.findById(partnerId)
          .select("-passwordHash")
          .lean(),
      ]);

      const stats = {
        totalJobs: jobs.length,

        activeJobs: jobs.filter(
          (job) =>
            job.status === "Approved"
        ).length,

        closedJobs: jobs.filter(
          (job) =>
            job.status === "Closed"
        ).length,

        totalApplications:
          applications.length,

        pendingReview: jobs.filter(
          (job) =>
            job.status === "Pending"
        ).length,

        drafts: jobs.filter(
          (job) =>
            job.status === "Draft"
        ).length,

        rejectedJobs: jobs.filter(
          (job) =>
            job.status === "Rejected"
        ).length,

        shortlisted: applications.filter(
          (app) =>
            app.status === "Shortlisted"
        ).length,

        interviews: applications.filter(
          (app) =>
            app.status === "Interview"
        ).length,

        selectedCandidates:
          applications.filter(
            (app) =>
              app.status === "Selected"
          ).length,
      };

      return res.status(200).json({
        success: true,

        data: {
          partner,

          partnerStatus:
            partner?.status || null,

          canPublishJobs:
            partner?.status === "Verified",

          stats,

          jobs,

          applications,
        },
      });
    } catch (error) {
      console.error(
        "Partner dashboard data error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load partner dashboard data.",
      });
    }
  }
);

/* =========================================================
   PARTNER - MY JOBS
   PARTNER ONLY
========================================================= */

router.get(
  "/jobs",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      const partnerId = String(
        req.user.id
      );

      const jobs = await Job.find({
        partnerId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
        jobs,
      });
    } catch (error) {
      console.error(
        "Partner jobs fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch your jobs.",
      });
    }
  }
);

/* =========================================================
   PARTNER - MY PROFILE
   GET PROFILE
   PARTNER ONLY
========================================================= */

router.get(
  "/me",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      const partner = await Partner.findById(
        req.user.id
      )
        .select("-passwordHash")
        .lean();

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Partner account not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: partner,
      });
    } catch (error) {
      console.error(
        "Partner profile fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch your profile.",
      });
    }
  }
);

/* =========================================================
   PARTNER - UPDATE MY PROFILE
   PATCH /api/partners/me
   PARTNER ONLY

   Editable fields:
   - contactPerson
   - phone
   - alternatePhone
   - website
   - address
   - city
   - state
   - country
   - postalCode

   Protected fields:
   - companyName
   - email
   - passwordHash
   - status
   - accountCreated
   - registrationCertificate
========================================================= */

router.patch(
  "/me",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      const partnerId = String(
        req.user.id || ""
      );

      /* -----------------------------------------
         VALIDATE PARTNER ID
      ----------------------------------------- */

      if (
        !partnerId ||
        !mongoose.Types.ObjectId.isValid(
          partnerId
        )
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid partner identity.",
        });
      }

      /* -----------------------------------------
         FIND PARTNER
      ----------------------------------------- */

      const partner =
        await Partner.findById(partnerId);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Partner account not found.",
        });
      }

      /* -----------------------------------------
         READ ONLY ALLOWED FIELDS
      ----------------------------------------- */

      const {
        contactPerson,
        phone,
        alternatePhone,
        website,
        address,
        city,
        state,
        country,
        postalCode,
      } = req.body || {};

      /* -----------------------------------------
         CONTACT PERSON
      ----------------------------------------- */

      if (
        contactPerson !== undefined
      ) {
        const value =
          String(contactPerson).trim();

        if (!value) {
          return res.status(400).json({
            success: false,
            message:
              "Contact person is required.",
          });
        }

        partner.contactPerson =
          value;
      }

      /* -----------------------------------------
         PHONE
      ----------------------------------------- */

      if (phone !== undefined) {
        partner.phone =
          String(phone).trim();
      }

      /* -----------------------------------------
         ALTERNATE PHONE
      ----------------------------------------- */

      if (
        alternatePhone !== undefined
      ) {
        partner.alternatePhone =
          String(
            alternatePhone
          ).trim();
      }

      /* -----------------------------------------
         WEBSITE
      ----------------------------------------- */

      if (website !== undefined) {
        partner.website =
          String(website).trim();
      }

      /* -----------------------------------------
         ADDRESS
      ----------------------------------------- */

      if (address !== undefined) {
        partner.address =
          String(address).trim();
      }

      /* -----------------------------------------
         CITY
      ----------------------------------------- */

      if (city !== undefined) {
        partner.city =
          String(city).trim();
      }

      /* -----------------------------------------
         STATE
      ----------------------------------------- */

      if (state !== undefined) {
        partner.state =
          String(state).trim();
      }

      /* -----------------------------------------
         COUNTRY
      ----------------------------------------- */

      if (country !== undefined) {
        partner.country =
          String(country).trim();
      }

      /* -----------------------------------------
         POSTAL CODE
      ----------------------------------------- */

      if (postalCode !== undefined) {
        partner.postalCode =
          String(postalCode).trim();
      }

      /* -----------------------------------------
         SAVE
      ----------------------------------------- */

      await partner.save();

      /* -----------------------------------------
         FETCH UPDATED PARTNER
         NEVER RETURN PASSWORD HASH
      ----------------------------------------- */

      const updatedPartner =
        await Partner.findById(
          partner._id
        )
          .select("-passwordHash")
          .lean();

      return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully.",
        data: updatedPartner,
        partner: updatedPartner,
      });
    } catch (error) {
      console.error(
        "Partner profile update error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update your profile.",
      });
    }
  }
);

/* =========================================================
   PARTNER - APPLICATIONS FOR MY JOBS
   PARTNER ONLY
========================================================= */

router.get(
  "/applications",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      const partnerId = String(
        req.user.id
      );

      const query = {
        partnerId,
      };

      const { job } =
        req.query || {};

      if (
        job &&
        mongoose.isValidObjectId(job)
      ) {
        query.jobId = String(job);
      }

      const applications =
        await Application.find(
          query
        ).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
        applications,
      });
    } catch (error) {
      console.error(
        "Partner applications fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch applications for your jobs.",
      });
    }
  }
);

/* =========================================================
   PARTNER - PUBLISH A DRAFT JOB
   VERIFIED PARTNER ONLY

   Draft
      ↓
   Publish
      ↓
   Pending
      ↓
   Admin Approval
========================================================= */

router.patch(
  "/jobs/:id/publish",
  authMiddleware,
  partnerMiddleware,
  verifiedPartnerMiddleware,
  async (req, res) => {
    try {
      const partnerId = String(
        req.user.id
      );

      const job =
        await Job.findOne({
          _id: req.params.id,
          partnerId,
        });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      if (job.status === "Draft") {
        job.status = "Pending";

        await job.save();
      }

      return res.status(200).json({
        success: true,
        message:
          "Job published successfully and sent for admin approval.",
        data: job,
      });
    } catch (error) {
      console.error(
        "Partner publish job error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to publish job.",
      });
    }
  }
);

/* =========================================================
   PARTNER - APPLICATION DETAILS
   PARTNER ONLY
========================================================= */

router.get(
  "/applications/:id",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application ID.",
        });
      }

      const partnerId = String(
        req.user.id
      );

      const jobIds = (
        await Job.find({
          partnerId,
        }).select("_id")
      ).map((job) =>
        String(job._id)
      );

      const application =
        await Application.findOne({
          _id: req.params.id,
          jobId: {
            $in: jobIds,
          },
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found for your jobs.",
        });
      }

      return res.status(200).json({
        success: true,
        data: application,
        application,
      });
    } catch (error) {
      console.error(
        "Partner application fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch application.",
      });
    }
  }
);

/* =========================================================
   PARTNER - UPDATE APPLICATION STATUS
   PARTNER ONLY
========================================================= */

router.patch(
  "/applications/:id/status",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application ID.",
        });
      }

      const partnerId = String(
        req.user.id
      );

      const { status } =
        req.body || {};

      const allowedStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ];

      if (
        !status ||
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status value.",
        });
      }

      const jobIds = (
        await Job.find({
          partnerId,
        }).select("_id")
      ).map((job) =>
        String(job._id)
      );

      const application =
        await Application.findOne({
          _id: req.params.id,
          jobId: {
            $in: jobIds,
          },
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found for your jobs.",
        });
      }

      application.status = status;

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          "Application status updated successfully.",
        data: application,
        application,
      });
    } catch (error) {
      console.error(
        "Partner application status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update application status.",
      });
    }
  }
);

/* =========================================================
   PARTNER - GET SINGLE JOB
   PARTNER ONLY
========================================================= */

router.get(
  "/jobs/:id",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid job ID.",
        });
      }

      const partnerId = String(
        req.user.id
      );

      const job =
        await Job.findOne({
          _id: req.params.id,
          partnerId,
        });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error(
        "Partner job fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch job.",
      });
    }
  }
);

/* =========================================================
   PARTNER - UPDATE / CLOSE OWN JOB
   PARTNER ONLY
========================================================= */

router.patch(
  "/jobs/:id",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid job ID.",
        });
      }

      const partnerId = String(
        req.user.id
      );

      const job =
        await Job.findOne({
          _id: req.params.id,
          partnerId,
        });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      const {
        jobTitle,
        title,
        jobType,
        category,
        industry,
        experience,
        qualification,
        location,
        country,
        salary,
        skills,
        description,
        requirements,
        contactEmail,
        contactPhone,
        openings,
        close,
      } = req.body || {};

      /* -----------------------------------------
         CLOSE JOB
      ----------------------------------------- */

      if (
        close === true ||
        close === "true"
      ) {
        job.status = "Closed";

        await job.save();

        return res.status(200).json({
          success: true,
          message:
            "Job closed successfully.",
          data: job,
        });
      }

      /* -----------------------------------------
         EDITABLE FIELDS
      ----------------------------------------- */

      const nextTitle = (
        jobTitle ||
        title ||
        ""
      ).trim();

      const nextJobType = (
        jobType ||
        ""
      ).trim();

      if (nextTitle) {
        job.jobTitle =
          nextTitle;
      }

      if (nextJobType) {
        job.jobType =
          nextJobType;
      }

      if (
        category !== undefined ||
        industry !== undefined
      ) {
        job.category = String(
          category ||
            industry ||
            ""
        ).trim();
      }

      if (
        experience !== undefined
      ) {
        job.experience =
          String(
            experience
          ).trim();
      }

      if (
        qualification !== undefined
      ) {
        job.qualification =
          String(
            qualification
          ).trim();
      }

      if (
        location !== undefined
      ) {
        job.location =
          String(location).trim();
      }

      if (
        country !== undefined
      ) {
        job.country =
          String(country).trim();
      }

      if (
        salary !== undefined
      ) {
        job.salary =
          String(salary).trim();
      }

      if (
        skills !== undefined
      ) {
        job.skills =
          String(skills).trim();
      }

      if (
        description !== undefined
      ) {
        job.description =
          String(
            description
          ).trim();
      }

      if (
        requirements !== undefined
      ) {
        job.requirements =
          String(
            requirements
          ).trim();
      }

      if (
        contactEmail !== undefined
      ) {
        job.contactEmail =
          String(
            contactEmail
          )
            .trim()
            .toLowerCase();
      }

      if (
        contactPhone !== undefined
      ) {
        job.contactPhone =
          String(
            contactPhone
          ).trim();
      }

      if (
        openings !== undefined
      ) {
        job.openings =
          openings;
      }

      await job.save();

      return res.status(200).json({
        success: true,
        message:
          "Job updated successfully.",
        data: job,
      });
    } catch (error) {
      console.error(
        "Partner job update error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update job.",
      });
    }
  }
);



router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid partner ID.",
        });
      }

      const partner =
        await Partner.findById(
          req.params.id
        );

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Partner not found.",
        });
      }

      return res.status(200).json({
        success: true,
        partner,
      });
    } catch (error) {
      console.error(
        "Get partner error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch partner.",
      });
    }
  }
);



router.patch(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const partner =
        await Partner.findById(
          req.params.id
        );

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Partner not found.",
        });
      }

      if (
        partner.status ===
        "Rejected"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A rejected partner cannot be approved directly.",
        });
      }

   

      if (
        partner.status ===
          "Verified" &&
        partner.accountCreated === true
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This partner is already approved.",
        });
      }


      let temporaryPassword = null;

      partner.status =
        "Verified";

      partner.accountCreated =
        true;

      partner.accountCreatedAt =
        partner.accountCreatedAt ||
        new Date();

      if (!partner.passwordHash) {
        temporaryPassword =
          generateTemporaryPassword();

        partner.passwordHash =
          await bcrypt.hash(
            temporaryPassword,
            12
          );
      }

      await partner.save();

  

      if (temporaryPassword) {
        try {
          await sendPartnerApprovalEmail({
            email: partner.email,
            companyName:
              partner.companyName,
            contactPerson:
              partner.contactPerson,
            temporaryPassword,
          });
        } catch (emailError) {
          console.error(
            "Partner approval email error:",
            emailError
          );
        }
      }

      return res.status(200).json({
        success: true,

        message:
          temporaryPassword
            ? "Partner approved successfully and login credentials have been sent to the registered email."
            : "Partner verified successfully. The partner can now publish jobs using their existing password.",

        partner: {
          id: partner._id,
          companyName:
            partner.companyName,
          email:
            partner.email,
          status:
            partner.status,
          accountCreated:
            partner.accountCreated,
        },
      });
    } catch (error) {
      console.error(
        "Approve partner error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to approve partner.",
      });
    }
  }
);



router.patch(
  "/:id/reject",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const partner =
        await Partner.findById(
          req.params.id
        );

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Partner not found.",
        });
      }

      partner.status =
        "Rejected";

      await partner.save();

      return res.status(200).json({
        success: true,
        message:
          "Partner rejected successfully.",
        partner,
      });
    } catch (error) {
      console.error(
        "Reject partner error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to reject partner.",
      });
    }
  }
);



module.exports = router;