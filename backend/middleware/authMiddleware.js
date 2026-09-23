
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};


const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

// =====================================================
// PARTNER MIDDLEWARE
// =====================================================
// Any logged-in partner (Pending, Verified or Rejected) can
// use the dashboard and manage DRAFT jobs. Only publishing
// requires verification, which verifiedPartnerMiddleware
// enforces below.
// =====================================================

const partnerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "partner") {
    return res.status(403).json({
      success: false,
      message: "Partner access required.",
    });
  }

  next();
};

// =====================================================
// VERIFIED PARTNER MIDDLEWARE
// =====================================================
// A partner account is created instantly from the public
// website so the partner can log in right away. However a
// job can only be PUBLISHED (sent to the admin queue) once
// the admin has verified the partner account.
//
// Usage:
//   authMiddleware, partnerMiddleware, verifiedPartnerMiddleware
// =====================================================

const verifiedPartnerMiddleware = async (req, res, next) => {
  try {
    const Partner = require("../models/Partner");

    const partnerId = String(
      req.user?.id || req.user?._id || ""
    );

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner identity missing.",
      });
    }

    const partner = await Partner.findById(partnerId).select(
      "status"
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner account not found.",
      });
    }

    if (partner.status !== "Verified") {
      return res.status(403).json({
        success: false,
        message:
          "Your partner account is pending verification. You can save jobs as drafts, but publishing will be enabled once the admin verifies your account.",
        partnerStatus: partner.status,
      });
    }

    req.partner = partner;

    next();
  } catch (error) {
    console.error("Partner verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify partner account.",
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  partnerMiddleware,
  verifiedPartnerMiddleware,
};

