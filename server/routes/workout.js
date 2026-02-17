const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const auth    = require("../middleware/authMiddleware");
const { generateWorkout, generateAutomatedTask, generateSurpriseQuest } = require("../utils/workoutGenerator");
const { calculateCP }           = require("../utils/cpSystem");
const { getRankFromXP }         = require("../utils/rankSystem");
const { checkAndApplyPenalty }  = require("../utils/penaltyEngine");

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
    workout.SEN    && { tag: "SEN",    desc: workout.SEN    },  // NEW
    workout.BOXING && { tag: "BOXING", desc: workout.BOXING },
  ].filter(Boolean);
}

// XP + stat rewards per task type (SEN added)
const TASK_REWARDS = {
  STR:    { xp: 20, str: 1 },
  AGI:    { xp: 20, agi: 1 },
  STA:    { xp: 20, sta: 1 },
  SEN:    { xp: 20, sen: 1 },  // NEW
  BOXING: { xp: 25 },
  REST:   { xp: 10 },
};

// ─── GET /api/workout/session ─────────────────────────────────────────────────
router.get("/session", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check and apply missed-day penalties
    const penaltyResult = await checkAndApplyPenalty(user);

    const today    = new Date().toDateString();
    const lastDate = user.lastWorkoutDate
      ? new Date(user.lastWorkoutDate).toDateString()
      : null;

    // New day — generate fresh workout + possibly automated task
    if (lastDate !== today) {
      const tasks = buildTaskList(generateWorkout());
      user.currentWorkout          = tasks;
      user.currentTaskIndex        = 0;
      user.workoutStarted          = false;
      user.lastWorkoutDate         = new Date();

      // 30% chance automated task
      const autoTask = generateAutomatedTask();
      user.automatedTask          = autoTask;
      user.automatedTaskCompleted = false;
      user.automatedTaskDate      = new Date();

      await user.save();
    } else {
      await user.save(); // save penalty changes if any
    }

    // Check penalty lock
    const locked = user.penaltyLockUntil && new Date() < new Date(user.penaltyLockUntil);

    res.json({
      tasks:        user.currentWorkout,
      currentIndex: user.currentTaskIndex,
      started:      user.workoutStarted,
      allDone:      user.currentTaskIndex >= user.currentWorkout.length,
      // Automated task (null if no task today)
      automatedTask:          user.automatedTask || null,
      automatedTaskCompleted: user.automatedTaskCompleted,
      // Penalty info
      penaltyApplied: penaltyResult.penaltyApplied,
      penaltyDetails: penaltyResult.details || [],
      missedDays:     penaltyResult.missedDays || 0,
      locked,
      lockUntil: user.penaltyLockUntil,
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

    // Check lock
    if (user.penaltyLockUntil && new Date() < new Date(user.penaltyLockUntil)) {
      return res.status(403).json({
        message: "SYSTEM LOCK ACTIVE",
        lockUntil: user.penaltyLockUntil,
      });
    }

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

    const oldRank = user.rank;
    user.exp = (user.exp || 0) + reward.xp;
    if (reward.str) user.str = (user.str || 0) + reward.str;
    if (reward.agi) user.agi = (user.agi || 0) + reward.agi;
    if (reward.sta) user.sta = (user.sta || 0) + reward.sta;
    if (reward.sen) user.sen = (user.sen || 0) + reward.sen; // NEW

    // Auto rank-up
    const newRankObj = getRankFromXP(user.exp);
    user.rank = newRankObj.rank;
    const rankedUp = oldRank !== newRankObj.rank;

    user.currentTaskIndex = idx + 1;
    const allDone = user.currentTaskIndex >= tasks.length;
    if (allDone) {
      user.streak = (user.streak || 0) + 1;
      // Reset 7-day miss counter on completion
      user.missedDays7 = 0;
    }

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

// ─── POST /api/workout/complete-automated ────────────────────────────────────
router.post("/complete-automated", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.automatedTask || user.automatedTaskCompleted)
      return res.status(400).json({ message: "No active automated task" });

    const task = user.automatedTask;
    const oldRank = user.rank;

    user.exp = (user.exp || 0) + task.xp;
    if (task.stat && user[task.stat] !== undefined) {
      user[task.stat] = (user[task.stat] || 0) + 2; // Automated tasks give +2 stat
    }

    const newRankObj = getRankFromXP(user.exp);
    user.rank = newRankObj.rank;
    const rankedUp = oldRank !== newRankObj.rank;

    user.automatedTaskCompleted = true;
    await user.save();

    res.json({
      message:  "Automated task complete",
      xpGained: task.xp,
      statGain: task.stat,
      newRank:  user.rank,
      rankedUp,
      totalExp: user.exp,
      cp:       calculateCP(user),
    });
  } catch (err) {
    console.error("Automated task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── GET /api/workout/surprise-quest ─────────────────────────────────────────
// Frontend polls this randomly; server generates one per day
router.get("/surprise-quest", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toDateString();
    const questDay = user.surpriseQuestDate
      ? new Date(user.surpriseQuestDate).toDateString()
      : null;

    // Already had a quest today
    if (questDay === today) {
      return res.json({
        quest:     null,
        reason:    "already_generated",
        completed: user.surpriseQuestCompleted,
      });
    }

    // 10% chance to generate quest on this poll
    if (Math.random() > 0.10) {
      return res.json({ quest: null, reason: "no_quest" });
    }

    const quest = generateSurpriseQuest();
    user.surpriseQuestDate      = new Date();
    user.surpriseQuestCompleted = false;
    await user.save();

    res.json({ quest, completed: false });
  } catch (err) {
    console.error("Surprise quest error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── POST /api/workout/complete-surprise ─────────────────────────────────────
router.post("/complete-surprise", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.surpriseQuestCompleted)
      return res.status(400).json({ message: "Quest already completed" });

    const { quest } = req.body;
    if (!quest) return res.status(400).json({ message: "Quest data missing" });

    const oldRank = user.rank;
    user.exp = (user.exp || 0) + (quest.xp || 30);
    if (quest.stat && user[quest.stat] !== undefined) {
      user[quest.stat] = (user[quest.stat] || 0) + 1;
    }

    const newRankObj = getRankFromXP(user.exp);
    user.rank = newRankObj.rank;
    const rankedUp = oldRank !== newRankObj.rank;

    user.surpriseQuestCompleted = true;
    await user.save();

    res.json({
      message:  "Surprise quest complete",
      xpGained: quest.xp || 30,
      newRank:  user.rank,
      rankedUp,
      totalExp: user.exp,
      cp:       calculateCP(user),
    });
  } catch (err) {
    console.error("Complete surprise error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
