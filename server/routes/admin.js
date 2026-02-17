const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const auth    = require("../middleware/authMiddleware");
const bcrypt  = require("bcryptjs");
const path    = require("path");
const fs      = require("fs");
const multer  = require("multer");

// ─── Admin guard ─────────────────────────────────────────────────────────────
function adminOnly(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });
  next();
}

// ─── Multer storage for combat move images ───────────────────────────────────
const IMAGES_DIR = path.join(__dirname, "../public/combat-images");
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const moveId  = req.params.moveId;
    const ext     = path.extname(file.originalname);
    cb(null, `${moveId}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// ════════════════════════════════════════════════════════
//  USER MANAGEMENT
// ════════════════════════════════════════════════════════

// GET /api/admin/users — all users
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "-password").lean();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/create-user — admin creates a user (with optional role)
router.post("/create-user", auth, adminOnly, async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({
      username,
      password: hashed,
      fullName: fullName || "",
      email:    email    || null,
      role:     role === "admin" ? "admin" : "user",
    });
    await user.save();
    res.status(201).json({ message: "User created", username: user.username, role: user.role });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/adjust-stats — edit XP, Rank, STR, AGI, STA, SEN, CP manually
router.post("/adjust-stats", auth, adminOnly, async (req, res) => {
  try {
    const { userId, str, agi, sta, sen, exp, rank, cp } = req.body;
    const update = {};
    if (str  !== undefined) update.str  = Number(str);
    if (agi  !== undefined) update.agi  = Number(agi);
    if (sta  !== undefined) update.sta  = Number(sta);
    if (sen  !== undefined) update.sen  = Number(sen);
    if (exp  !== undefined) update.exp  = Number(exp);
    if (rank !== undefined) update.rank = rank;
    await User.findByIdAndUpdate(userId, update);
    res.json({ message: "Stats updated", update });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/add-xp — add or subtract XP from user
router.post("/add-xp", auth, adminOnly, async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.exp = Math.max(0, (user.exp || 0) + Number(amount));
    await user.save();
    res.json({ message: "XP updated", newExp: user.exp });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/set-rank — force-set rank
router.post("/set-rank", auth, adminOnly, async (req, res) => {
  try {
    const { userId, rank } = req.body;
    await User.findByIdAndUpdate(userId, { rank });
    res.json({ message: "Rank set", rank });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/set-role — promote/demote admin
router.post("/set-role", auth, adminOnly, async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!["admin","user"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    await User.findByIdAndUpdate(userId, { role });
    res.json({ message: "Role updated", role });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/reset-exp — full reset
router.post("/reset-exp", auth, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      exp: 0, rank: "F", str: 0, agi: 0, sta: 0, sen: 0,
      streak: 0, missedDaysTotal: 0, missedDays30: 0, missedDays7: 0,
    });
    res.json({ message: "User reset complete" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/remove-penalty — clear penalty lock
router.post("/remove-penalty", auth, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      penaltyLockUntil: null, missedDays7: 0, missedDays30: 0,
    });
    res.json({ message: "Penalty cleared" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/admin/delete-user
router.delete("/delete-user", auth, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/reset-password — admin resets user password
router.post("/reset-password", auth, adminOnly, async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4)
      return res.status(400).json({ message: "Password must be at least 4 chars" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
    res.json({ message: "Password reset" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ════════════════════════════════════════════════════════
//  STATS OVERVIEW
// ════════════════════════════════════════════════════════

router.get("/stats-overview", auth, adminOnly, async (req, res) => {
  try {
    const total   = await User.countDocuments();
    const locked  = await User.countDocuments({ penaltyLockUntil: { $gt: new Date() } });
    const admins  = await User.countDocuments({ role: "admin" });
    const byRank  = await User.aggregate([
      { $group: { _id: "$rank", count: { $sum: 1 } } },
      { $sort:  { _id: 1 } }
    ]);
    const topUsers = await User.find({}, "username exp rank str agi sta sen")
      .sort({ exp: -1 }).limit(5).lean();
    res.json({ total, locked, admins, byRank, topUsers });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ════════════════════════════════════════════════════════
//  COMBAT MOVE IMAGES
// ════════════════════════════════════════════════════════

// GET /api/admin/combat-images — list all uploaded images
router.get("/combat-images", auth, adminOnly, (req, res) => {
  try {
    if (!fs.existsSync(IMAGES_DIR)) return res.json({ images: [] });
    const files = fs.readdirSync(IMAGES_DIR).filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );
    const images = files.map(f => ({
      moveId: path.basename(f, path.extname(f)),
      url:    `/combat-images/${f}`,
      filename: f,
    }));
    res.json({ images });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/combat-images/:moveId — upload image for a move
router.post("/combat-images/:moveId", auth, adminOnly, upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/combat-images/${req.file.filename}`;
    res.json({ message: "Image uploaded", moveId: req.params.moveId, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/combat-images/:moveId — remove image for a move
router.delete("/combat-images/:moveId", auth, adminOnly, (req, res) => {
  try {
    const moveId = req.params.moveId;
    const exts   = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    let deleted  = false;
    for (const ext of exts) {
      const filePath = path.join(IMAGES_DIR, `${moveId}${ext}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
        break;
      }
    }
    if (deleted) res.json({ message: "Image deleted" });
    else res.status(404).json({ message: "Image not found" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// ════════════════════════════════════════════════════════
//  GAME SETTINGS — XP / CP / Rank / Stat Caps
// ════════════════════════════════════════════════════════
const AdminSettings = require("../models/AdminSettings");

// GET /api/admin/settings
router.get("/settings", auth, adminOnly, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/settings — save all settings
router.post("/settings", auth, adminOnly, async (req, res) => {
  try {
    const { xpRewards, cpWeights, rankThresholds, statCaps } = req.body;
    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();

    if (xpRewards)      settings.xpRewards      = xpRewards;
    if (cpWeights)      settings.cpWeights       = cpWeights;
    if (rankThresholds) settings.rankThresholds  = rankThresholds;
    if (statCaps)       settings.statCaps        = statCaps;

    settings.markModified("statCaps");
    await settings.save();
    res.json({ message: "Settings saved", settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});