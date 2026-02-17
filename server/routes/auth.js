const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { calculateCP }   = require("../utils/cpSystem");
const getClassification = require("../utils/classification");
const { getRankFromXP } = require("../utils/rankSystem");

// ─── GET /api/auth/profile ───────────────────────────────────────────────────
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Auto-update rank based on XP every time profile is fetched
    const rankObj = getRankFromXP(user.exp || 0);
    if (user.rank !== rankObj.rank) {
      user.rank = rankObj.rank;
      await user.save();
    }

    const cp             = calculateCP(user);
    const classification = getClassification(user);

    res.json({
      username:        user.username,
      fullName:        user.fullName,
      email:           user.email,
      birthdate:       user.birthdate,
      photo:           user.photo,
      licenseNumber:   user.licenseNumber,
      role:            user.role,
      rank:            user.rank,
      exp:             user.exp || 0,
      str:             user.str || 0,
      agi:             user.agi || 0,
      sta:             user.sta || 0,
      streak:          user.streak || 0,
      cp,
      classification,
      licenseUnlocked: user.rank !== "F",
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, email, birthdate, photo } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({
      username,
      password: hashed,
      role: "user",
      ...(fullName  && { fullName }),
      ...(email     && { email }),
      ...(birthdate && { birthdate }),
      ...(photo     && { photo }),
    });
    await user.save();
    res.json({ message: "Hunter registered" });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(400).json({ message: `${field} already in use` });
    }
    res.status(500).json({ message: "Registration failed" });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;