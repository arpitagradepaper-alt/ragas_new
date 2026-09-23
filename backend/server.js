const dns = require("dns");

dns.setServers(["8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();


const contactRoutes = require("./routes/contactRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const employerRoutes = require("./routes/employerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes"); // Yehi route aapka user applications handle karega
const partnerRoutes = require("./routes/partnerRoutes");
const chatbotLogRoutes = require("./routes/chatbotLogRoutes");


const userAuthRoutes = require("./routes/userAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const partnerAuthRoutes = require("./routes/partnerAuthRoutes");

const app = express();

// ==============================
// CORS
// ==============================
// Allowed browser origins. Local dev ports + production domains are always
// allowed; extra origins can be added without a code change via the
// comma-separated CORS_ORIGINS env var (e.g. a Vercel preview URL).
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://ragascareerworld.com",
  "https://www.ragascareerworld.com",
  "https://rosybrown-snake-826018.hostingersite.com",
  "https://agent-6ab3c798c627b--magnificent-rugelach-0b7958.netlify.app",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...DEFAULT_ORIGINS, ...envOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, Postman, server-to-server) that
      // send no Origin header at all.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked request from origin: ${origin}`);

      return callback(new Error(`Origin ${origin} not allowed by CORS.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// SECURITY HEADERS + RATE LIMITS
// ==============================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// Global limiter - keeps brute force and spam in check
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Strict limiter for auth endpoints (login / register / OTP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again in 15 minutes.",
  },
});

app.use(globalLimiter);
app.use("/api/auth", authLimiter);

// Public form endpoints also get a stricter limit (spam protection)
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions, please try again later.",
  },
});

app.use("/api/contact", formLimiter);
app.use("/api/candidates", formLimiter);
app.use("/api/chatbot-logs", formLimiter);


app.use("/api/contact", contactRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes); // Base path /api/applications ke andar ab aapke sabhi application routes chalenge
app.use("/api/partners", partnerRoutes);
app.use("/api/chatbot-logs", chatbotLogRoutes);


app.use("/api/auth/user", userAuthRoutes);


app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/auth/partner", partnerAuthRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RAGAS CAREER WORLD Backend is running!",
  });
});

// ==============================
// HEALTH CHECK
// ==============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy.",
  });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================
app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Server error.",
  });
});

// ==============================
// MONGODB CONNECTION
// ==============================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file.");
  process.exit(1);
}

console.log("Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI, {
    family: 4,
    tls: true,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 20000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("");
    console.error("========== MONGODB CONNECTION ERROR ==========");
    console.error("Name:", error.name);
    console.error("Message:", error.message);

    if (error.reason) {
      console.error("Reason:", error.reason);
    }

    if (error.code) {
      console.error("Code:", error.code);
    }

    console.error("==============================================");
    console.error("");

    process.exit(1);
  });