const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes    = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const adminRoutes   = require("./routes/admin");

const app = express();

// ─── CORS Configuration ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://solo-v2-z2hd.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// ─── Serve uploaded combat images statically ─────────────────────────────────
app.use("/combat-images", express.static(path.join(__dirname, "public/combat-images")));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solo-system";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✓ MongoDB Connected"))
  .catch(err => {
    console.error("✗ MongoDB Error:", err);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/admin",   adminRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    env: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message 
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});