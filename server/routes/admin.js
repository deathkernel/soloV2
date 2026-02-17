const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const { calculateCP } = require("../utils/cpSystem");

router.get("/users", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const users = await User.find();

  const enriched = users.map(u => ({
    ...u.toObject(),
    cp: calculateCP(u)
  }));

  res.json(enriched);
});

router.post("/reset-exp", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const { userId } = req.body;
  const user = await User.findById(userId);

  if (!user)
    return res.status(404).json({ message: "User not found" });

  user.exp = 0;
  await user.save();

  res.json({ message: "EXP reset" });
});

module.exports = router;
