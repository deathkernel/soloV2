const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");
const auth     = require("../middleware/authMiddleware");
const { calculateCP }          = require("../utils/cpSystem");
const getClassification        = require("../utils/classification");
const { getRankFromXP }        = require("../utils/rankSystem");
const { checkAndApplyPenalty } = require("../utils/penaltyEngine");

const SECRET     = process.env.JWT_SECRET   || "shadowmonarch_secret";
const ADMIN_CODE = process.env.ADMIN_CODE   || "ShadowMonarch@999"; // ← Change this to your secret

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, email, birthdate, photo } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({
      username,
      password: hashed,
      fullName:  fullName  || "",
      email:     email     || null,
      birthdate: birthdate || null,
      photo:     photo     || "",
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /api/auth/admin-register ───────────────────────────────────────────
// Separate admin registration — requires secret admin code
router.post("/admin-register", async (req, res) => {
  try {
    const { username, password, fullName, adminCode } = req.body;

    // Validate inputs
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    if (!adminCode)
      return res.status(400).json({ message: "Admin access code required" });

    // Verify secret code
    if (adminCode !== ADMIN_CODE)
      return res.status(403).json({ message: "Invalid admin access code" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    // Check username not taken
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    // Create admin user
    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({
      username,
      password: hashed,
      fullName: fullName || "",
      role:     "admin",   // ← always admin
    });
    await user.save();

    console.log(`✓ New admin created: ${username}`);
    res.status(201).json({ message: "Admin account created successfully", username: user.username });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginDate = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── GET /api/auth/profile ────────────────────────────────────────────────────
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await checkAndApplyPenalty(user);
    await user.save();

    const cp             = calculateCP(user);
    const classification = getClassification(user);
    const rankInfo       = getRankFromXP(user.exp);
    const locked         = user.penaltyLockUntil && new Date() < new Date(user.penaltyLockUntil);

    res.json({
      _id:      user._id,
      username: user.username,
      fullName: user.fullName,
      email:    user.email,
      birthdate:user.birthdate,
      photo:    user.photo,
      role:     user.role,
      rank:     user.rank,
      exp:      user.exp,
      streak:   user.streak,
      str:      user.str,
      agi:      user.agi,
      sta:      user.sta,
      sen:      user.sen,
      cp,
      classification,
      rankInfo,
      licenseNumber:   user.licenseNumber,
      missedDaysTotal: user.missedDaysTotal,
      locked,
      lockUntil: user.penaltyLockUntil,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;