const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const auth    = require("../middleware/authMiddleware");
const generateWorkout   = require("../utils/workoutGenerator");
const { calculateCP }   = require("../utils/cpSystem");
const { getRankFromXP } = require("../utils/rankSystem");

// ─── Flatten raw workout into ordered task list ───────────────────────────────
function buildTaskList(workout) {
  if (workout.rest)
    return [{ tag: "REST", desc: "Rest Day — Recovery Protocol Active", isRest: true }];
  if (workout.advancedBoxing)
    return [{ tag: "BOXING", desc: workout.advancedBoxing }];
  return [
    workout.STR    && { tag: "STR",    desc: workout.STR    },
    workout.AGI    && { tag: "AGI",    desc: workout.AGI    },
    workout.STA    && { tag: "STA",    desc: workout.STA    },
    workout.BOXING && { tag: "BOXING", desc: workout.BOXING },
  ].filter(Boolean);
}

// XP + stat rewards per task type
const TASK_REWARDS = {
  STR:    { xp: 20, str: 1 },
  AGI:    { xp: 20, agi: 1 },
  STA:    { xp: 20, sta: 1 },
  BOXING: { xp: 25 },
  REST:   { xp: 10 },
};

// ─── GET /api/workout/session ─────────────────────────────────────────────────
router.get("/session", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today    = new Date().toDateString();
    const lastDate = user.lastWorkoutDate
      ? new Date(user.lastWorkoutDate).toDateString()
      : null;

    // New day — generate fresh workout
    if (lastDate !== today) {
      const tasks = buildTaskList(generateWorkout());
      user.currentWorkout   = tasks;
      user.currentTaskIndex = 0;
      user.workoutStarted   = false;
      user.lastWorkoutDate  = new Date();
      await user.save();
    }

    res.json({
      tasks:        user.currentWorkout,
      currentIndex: user.currentTaskIndex,
      started:      user.workoutStarted,
      allDone:      user.currentTaskIndex >= user.currentWorkout.length,
    });
  } catch (err) {
    console.error("Session error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /api/workout/start ──────────────────────────────────────────────────
router.post("/start", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.workoutStarted = true;
    await user.save();
    res.json({ started: true });
  } catch (err) {
    console.error("Start error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /api/workout/complete-task ─────────────────────────────────────────
router.post("/complete-task", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tasks = user.currentWorkout;
    const idx   = user.currentTaskIndex;

    if (idx >= tasks.length)
      return res.json({ message: "All tasks done", allDone: true });

    const task   = tasks[idx];
    const reward = TASK_REWARDS[task.tag] || { xp: 15 };

    // Apply rewards
    const oldRank = user.rank;
    user.exp = (user.exp || 0) + reward.xp;
    if (reward.str) user.str = (user.str || 0) + reward.str;
    if (reward.agi) user.agi = (user.agi || 0) + reward.agi;
    if (reward.sta) user.sta = (user.sta || 0) + reward.sta;

    // Auto rank-up check
    const newRankObj = getRankFromXP(user.exp);
    user.rank = newRankObj.rank;
    const rankedUp = oldRank !== newRankObj.rank;

    user.currentTaskIndex = idx + 1;
    const allDone = user.currentTaskIndex >= tasks.length;
    if (allDone) user.streak = (user.streak || 0) + 1;

    await user.save();

    res.json({
      completedTag: task.tag,
      nextIndex:    user.currentTaskIndex,
      allDone,
      xpGained:     reward.xp,
      totalExp:     user.exp,
      newRank:      user.rank,
      rankedUp,
      cp:           calculateCP(user),
      streak:       user.streak,
    });
  } catch (err) {
    console.error("Complete task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;