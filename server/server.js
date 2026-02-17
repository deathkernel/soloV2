const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workout");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json({ limit: "10mb" }));

mongoose.connect("mongodb://127.0.0.1:27017/solo-system")
  .then(() => console.log("✓ MongoDB Connected"))
  .catch(err => console.error("✗ MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.url} not found`
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error"
  });
});

app.listen(5000, () => {
  console.log("✓ Server running on http://localhost:5000");
});
