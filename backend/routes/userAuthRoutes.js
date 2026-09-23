
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.js");
const LoginLog = require("../models/LoginLog");
const Candidate = require("../models/Candidate");
const { sendPasswordResetOtp } = require("../services/mailer.js");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password: hashedPassword,
    });

    await Candidate.create({
    userId: user._id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
  });
    

    return res.status(201).json({
      success: true,
      message: "User registration successful.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during user registration.",
    });
  }
});

// ==============================
// USER LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    // JWT secret check
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration is missing.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store login event in dedicated collection for login visibility
    await LoginLog.create({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: "user",
      collectionName: "users",
    });

    // Successful login
    return res.status(200).json({
      success: true,
      message: "User login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("User login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during user login.",
    });
  }
});

const hashOtp = (email, otp) =>
  crypto
    .createHash("sha256")
    .update(`${email}:${otp}:${process.env.JWT_SECRET}`)
    .digest("hex");

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    // Do not reveal whether an email address is registered.
    if (!user) {
      return res.json({ success: true, message: "If this email is registered, an OTP has been sent." });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.resetOtpHash = hashOtp(email, otp);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpAttempts = 0;
    await user.save();

    await sendPasswordResetOtp({ email, fullName: user.fullName, otp });

    return res.json({ success: true, message: "OTP sent to your email address." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Unable to send OTP. Please try again later." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email });
    const isExpired = !user?.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date();
    const isValid = user && user.resetOtpHash === hashOtp(email, String(otp));

    if (!user || isExpired || !isValid || user.resetOtpAttempts >= 5) {
      if (user) {
        user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
        await user.save();
      }
      return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = undefined;
    user.resetOtpExpiresAt = undefined;
    user.resetOtpAttempts = 0;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Unable to reset password. Please try again later." });
  }
});

module.exports = router;
