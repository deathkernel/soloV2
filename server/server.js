const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes    = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const adminRoutes   = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Static files
app.use("/combat-images", express.static(path.join(__dirname, "public/combat-images")));

// Root route (important for Render test)
app.get("/", (req, res) => {
  res.send("Solo System Backend Running 🚀");
});

// MongoDB (USE ENV VARIABLE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB Connected"))
  .catch(err => console.error("✗ MongoDB Error:", err));

// Routes
app.use("/api/auth",    authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/admin",   adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// IMPORTANT: Use Render Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
