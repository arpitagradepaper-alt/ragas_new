const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Partner = require("../models/Partner");
const LoginLog = require("../models/LoginLog");

const router = express.Router();

/* =========================================================
   PARTNER LOGIN
========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    /* -----------------------------------------
       FIND PARTNER
    ----------------------------------------- */

    const partner = await Partner.findOne({
      email: normalizedEmail,
    });

    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* -----------------------------------------
       CHECK LOGIN CREDENTIALS
       Partners choose their own password at
       registration, so a Pending review status
       no longer blocks login. They only need a
       valid password on file.
    ----------------------------------------- */

    if (!partner.passwordHash) {
      return res.status(403).json({
        success: false,
        message:
          "Your partner account is not ready for login. Please contact support.",
      });
    }

    /* -----------------------------------------
       CHECK PASSWORD
    ----------------------------------------- */

    const isPasswordCorrect = await bcrypt.compare(
      password,
      partner.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* -----------------------------------------
       CREATE JWT
    ----------------------------------------- */

    const token = jwt.sign(
      {
        id: partner._id,
        email: partner.email,
        role: "partner",
        companyName: partner.companyName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await LoginLog.create({
      fullName: partner.contactPerson || partner.companyName,
      email: partner.email,
      phone: partner.phone || "",
      role: "partner",
      collectionName: "partners",
    });

    /* -----------------------------------------
       RESPONSE
    ----------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Partner login successful.",

      token,

      partner: {
        id: partner._id,
        role: "partner",
        companyName: partner.companyName,
        contactPerson: partner.contactPerson,
        email: partner.email,
        phone: partner.phone,
        partnerType: partner.partnerType,
        specialization: partner.specialization,
        geography: partner.geography,
        status: partner.status,
        accountCreated: partner.accountCreated,
      },
    });
  } catch (error) {
    console.error("Partner login error:", error);

    return res.status(500).json({
      success: false,
      message: "Partner login failed.",
    });
  }
});

module.exports = router;