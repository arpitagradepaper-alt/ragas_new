const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Partner = require("../models/Partner");
const {
  authMiddleware,
  adminMiddleware,
  partnerMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// PARTNER - CREATE DRAFT / PENDING JOB
// =====================================================
// A partner account is activated instantly from the public
// website, but publishing is only allowed after the admin
// verifies the account.
//
// The body may contain `publish: true` to request
// publishing. That is refused with 403 unless the partner
// account status is "Verified".
//
// companyName and partnerId are always taken from the
// logged-in partner so they cannot be spoofed.
// =====================================================

router.post(
  "/",
  authMiddleware,
  partnerMiddleware,
  async (req, res) => {
    try {
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
        publish,
      } = req.body || {};

      const finalTitle = (jobTitle || title || "").trim();
      const finalJobType = (jobType || "").trim();

      // -----------------------------------------------
      // REQUIRED FIELDS
      // -----------------------------------------------

      if (
        !finalTitle ||
        !finalJobType ||
        !(location || "").trim() ||
        !(description || "").trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Job title, job type, location and description are required.",
        });
      }

      // -----------------------------------------------
      // PARTNER ACCOUNT
      // -----------------------------------------------

      const partner = await Partner.findById(req.user.id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Partner account not found.",
        });
      }

      // -----------------------------------------------
      // PUBLISH GATE
      // -----------------------------------------------
      // Drafts are always allowed. Publishing requires a
      // Verified partner account.
      // -----------------------------------------------

      const wantsToPublish =
        publish === true ||
        publish === "true" ||
        publish === "Publish";

      if (wantsToPublish && partner.status !== "Verified") {
        return res.status(403).json({
          success: false,
          message:
            "Your partner account is pending verification. You can save this job as a draft, but publishing will be enabled once the admin verifies your account.",
          partnerStatus: partner.status,
        });
      }

      const job = new Job({
        partnerId: String(partner._id),

        companyName: partner.companyName || "Partner",

        jobTitle: finalTitle,
        jobType: finalJobType,
        category: (category || industry || "").trim(),
        experience: (experience || "").trim(),
        qualification: (qualification || "").trim(),
        location: (location || "").trim(),
        country: (country || "").trim(),
        salary: (salary || "").trim(),
        skills: (skills || "").trim(),
        description: (description || "").trim(),
        requirements: (requirements || "").trim(),
        contactEmail: (
          contactEmail ||
          partner.email ||
          ""
        )
          .toString()
          .trim()
          .toLowerCase(),
        contactPhone: (
          contactPhone ||
          partner.phone ||
          ""
        ).trim(),
        openings,

        // Draft until the partner (with a verified account)
        // publishes, or until the admin approves it.
        status: wantsToPublish ? "Pending" : "Draft",
      });

      await job.save();

      return res.status(201).json({
        success: true,
        message: wantsToPublish
          ? "Job published successfully and sent for admin approval."
          : "Job saved as a draft. Publish it once your partner account is verified.",
        data: job,
      });
    } catch (error) {
      console.error("Job posting error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
      });
    }
  }
);


// =====================================================
// GET - PUBLIC APPROVED JOBS
// =====================================================
// Current Openings uses this API.
// Only Approved jobs are visible publicly.
// =====================================================

router.get("/", async (req, res) => {
  try {
    const {
      keyword = "",
      location = "",
      industry = "",
    } = req.query;

    const filters = [
      {
        status: "Approved",
      },
    ];

    // -----------------------------------------------
    // KEYWORD SEARCH
    // -----------------------------------------------

    if (keyword.trim()) {
      const search = keyword.trim();

      filters.push({
        $or: [
          {
            jobTitle: {
              $regex: search,
              $options: "i",
            },
          },
          {
            category: {
              $regex: search,
              $options: "i",
            },
          },
          {
            skills: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            companyName: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });
    }


    // -----------------------------------------------
    // LOCATION SEARCH
    // -----------------------------------------------

    if (location.trim()) {
      const searchLocation = location.trim();

      filters.push({
        $or: [
          {
            location: {
              $regex: searchLocation,
              $options: "i",
            },
          },
          {
            country: {
              $regex: searchLocation,
              $options: "i",
            },
          },
        ],
      });
    }


    // -----------------------------------------------
    // INDUSTRY SEARCH
    // -----------------------------------------------

    if (industry.trim()) {
      filters.push({
        category: {
          $regex: industry.trim(),
          $options: "i",
        },
      });
    }


    const jobs = await Job.find({
      $and: filters,
    }).sort({
      createdAt: -1,
    });


    return res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    console.error("Search jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search jobs.",
    });
  }
});


// =====================================================
// ADMIN - GET ALL JOBS
// =====================================================
// Admin sees:
// Pending
// Approved
// Rejected
// Closed
//
// IMPORTANT:
// This route MUST come before /:id
// =====================================================

router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Partner drafts are private to the partner panel. Admin must not
    // see or approve them until the partner publishes.
    const jobs = await Job.find({
      status: { $ne: "Draft" },
    })
      .sort({
        createdAt: -1,
      });


    return res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    console.error(
      "Admin fetch all jobs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch all jobs.",
    });
  }
});


// =====================================================
// ADMIN - GET SINGLE JOB
// =====================================================
// Admin can see ANY status.
// =====================================================

router.get("/admin/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }


    // Drafts belong to the partner panel until they are published.
    const job = await Job.findOne({
      _id: id,
      status: { $ne: "Draft" },
    });


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }


    return res.json({
      success: true,
      data: job,
    });

  } catch (error) {
    console.error(
      "Admin fetch job error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch job.",
    });
  }
});


// =====================================================
// ADMIN - UPDATE JOB STATUS (APPROVE / REJECT / CLOSE)
// =====================================================
// PATCH /api/jobs/:id/status
//
// Body:
//
// {
//   "status": "Approved"
// }
//
// Allowed:
//
// Pending
// Approved
// Rejected
// Closed
//
// Admin only. Without this guard any visitor could approve
// a job and bypass the admin approval queue entirely.
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};


    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }


    // -----------------------------------------------
    // VALIDATE STATUS
    // -----------------------------------------------

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Closed",
    ];


    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are Pending, Approved, Rejected and Closed.",
      });
    }


    // -----------------------------------------------
    // FIND JOB
    // -----------------------------------------------

    const job = await Job.findById(id);


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }


    // -----------------------------------------------
    // UPDATE STATUS
    // -----------------------------------------------

    job.status = status;

    await job.save();


    return res.json({
      success: true,
      message: `Job status updated to ${status}.`,
      data: job,
    });

  } catch (error) {
    console.error(
      "Job status update error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update job status.",
    });
  }
  }
);



// =====================================================
// GET - SINGLE PUBLIC JOB
// =====================================================
// Only Approved jobs can be viewed publicly.
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }


    const job = await Job.findOne({
      _id: id,
      status: "Approved",
    });


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }


    return res.json({
      success: true,
      data: job,
    });

  } catch (error) {
    console.error(
      "Fetch public job error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch job.",
    });
  }
});

// =====================================================
// POST - ADMIN CREATE JOB (AUTO-APPROVED)
// =====================================================
// Admin only.
//
// IMPORTANT BUSINESS RULE:
// The admin is the one who verifies partner accounts, so the
// admin can publish a job on behalf of ANY partner - even a
// partner whose account is still Pending or Rejected. The
// partner verification gate applies only to the partner's own
// dashboard, never to the admin.
//
// Admin-created jobs skip the approval queue (status Approved).
// =====================================================
router.post(
  "/admin/create",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        postFor, // "self" | "partner"
        partnerId,
        companyName,
        jobTitle,
        jobType,
        category,
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
      } = req.body || {};

      const finalCompanyName =
        postFor === "self" ? "RAGAS CAREER WORLD" : (companyName || "").trim();

      if (!finalCompanyName || !jobTitle || !jobType || !location || !description) {
        return res.status(400).json({
          success: false,
          message: "Company name, job title, job type, location and description are required.",
        });
      }

      const job = new Job({
        partnerId: postFor === "partner" && partnerId ? String(partnerId).trim() : null,
        companyName: finalCompanyName,
        jobTitle: jobTitle.trim(),
        jobType: jobType.trim(),
        category: (category || "").trim(),
        experience: (experience || "").trim(),
        qualification: (qualification || "").trim(),
        location: location.trim(),
        country: (country || "India").trim(),
        salary: (salary || "").trim(),
        skills: (skills || "").trim(),
        description: description.trim(),
        requirements: (requirements || "").trim(),
        contactEmail: (contactEmail || "").trim().toLowerCase(),
        contactPhone: (contactPhone || "").trim(),
        openings: openings ? Number(openings) : null,

        // Admin posts are auto-approved and skip the approval queue.
        // This deliberately ignores the partner's verification status
        // because the admin is the verifier.
        status: "Approved",
      });

      await job.save();

      return res.status(201).json({
        success: true,
        message: "Job created and published successfully.",
        data: job,
      });
    } catch (error) {
      console.error("Admin job post error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create job.",
      });
    }
  }
);


module.exports = router;