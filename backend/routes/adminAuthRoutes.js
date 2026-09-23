const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.js");
const LoginLog = require("../models/LoginLog");

const router = express.Router();


// =====================================================
// ADMIN REGISTRATION
// -----------------------------------------------------
// BOOTSTRAP: the very first admin account can be created
// without a token (initial server setup). After that,
// creating more admins requires an ADMIN token - this
// endpoint used to be publicly open, which meant anyone
// could create an admin account.
// =====================================================
router.post("/register", async (req, res) => {
  try {
    // -----------------------------------------------
    // SECURITY: only existing admins can create new
    // admins. The very first admin can be created
    // while the admin collection is still empty
    // (one-time bootstrap).
    // -----------------------------------------------

    const existingAdminCount = await Admin.countDocuments();

    if (existingAdminCount > 0) {
      const authHeader =
        req.headers.authorization || "";

      if (!authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
          success: false,
          message:
            "Admin authorization is required to register a new admin.",
        });
      }

      try {
        const jwt = require("jsonwebtoken");

        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
          return res.status(403).json({
            success: false,
            message:
              "Admin authorization is required to register a new admin.",
          });
        }
      } catch (tokenError) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired admin session.",
        });
      }
    }

    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // -----------------------------------------------
    // CHECK EXISTING ADMIN
    // -----------------------------------------------
    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "An admin account with this email already exists.",
      });
    }

    // -----------------------------------------------
    // HASH PASSWORD
    // -----------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------------------------
    // CREATE ADMIN
    // -----------------------------------------------
    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: "admin",
    });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Admin registration successful.",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Admin registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin registration.",
    });
  }
});


// =====================================================
// ADMIN LOGIN
// =====================================================
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // -----------------------------------------------
    // FIND ADMIN
    // -----------------------------------------------
    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // -----------------------------------------------
    // CHECK PASSWORD
    // -----------------------------------------------
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // -----------------------------------------------
    // CREATE JWT
    // -----------------------------------------------
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -----------------------------------------------
    // LOGIN LOG
    // -----------------------------------------------
    await LoginLog.create({
      fullName: admin.fullName || "Admin",
      email: admin.email,
      phone: admin.phone || "",
      role: "admin",
      collectionName: "admins",
    });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------
    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
});


module.exports = router;