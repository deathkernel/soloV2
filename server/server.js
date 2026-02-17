const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes    = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const adminRoutes   = require("./routes/admin");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ─── Serve uploaded combat images statically ─────────────────────────────────
app.use("/combat-images", express.static(path.join(__dirname, "public/combat-images")));

mongoose.connect("mongodb://127.0.0.1:27017/solo-system")
  .then(() => console.log("✓ MongoDB Connected"))
  .catch(err => console.error("✗ MongoDB Error:", err));

app.use("/api/auth",    authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/admin",   adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✓ Server running on http://0.0.0.0:5000");
  console.log("✓ Access from phone at http://<YOUR_PC_IP>:5000");
});