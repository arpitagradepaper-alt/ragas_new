const express = require("express");
const router = express.Router();
// Apna existing Application model import karein (path apne project ke hisab se check kar lein)
const Application = require("../models/Application"); 

// GET: Logged-in user ki sari applications fetch karne ke liye
router.get("/my-applications", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    // Existing Application model se user ki applications query karein
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching applications" 
    });
  }
});

module.exports = router;