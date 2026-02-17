const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, default: "user" },

  fullName:      { type: String, default: "" },
  email:         { type: String, default: null, sparse: true },
  birthdate:     { type: Date,   default: null },
  photo:         { type: String, default: "" },
  licenseNumber: { type: String, default: null, sparse: true },

  rank:      { type: String, default: "F" },
  exp:       { type: Number, default: 0 },
  streak:    { type: Number, default: 0 },
  skipCount: { type: Number, default: 0 },

  // ── STATS (SEN added) ────────────────────────────────────
  str: { type: Number, default: 0 },
  agi: { type: Number, default: 0 },
  sta: { type: Number, default: 0 },
  sen: { type: Number, default: 0 }, // NEW: Perception / Sensing

  // ── WORKOUT SESSION ──────────────────────────────────────
  currentWorkout:   { type: Array,   default: [] },
  currentTaskIndex: { type: Number,  default: 0 },
  workoutStarted:   { type: Boolean, default: false },
  lastWorkoutDate:  { type: Date,    default: null },

  // ── AUTOMATED TASK ───────────────────────────────────────
  // Generated once per day, 30% chance
  automatedTask:          { type: Object,  default: null },  // { tag, desc, xp }
  automatedTaskCompleted: { type: Boolean, default: false },
  automatedTaskDate:      { type: Date,    default: null },

  // ── SURPRISE QUEST ───────────────────────────────────────
  // Generated once per day randomly
  surpriseQuestDate:      { type: Date,    default: null },
  surpriseQuestCompleted: { type: Boolean, default: false },

  // ── PENALTY SYSTEM ───────────────────────────────────────
  missedDaysTotal:  { type: Number, default: 0 },
  missedDays30:     { type: Number, default: 0 },
  missedDays7:      { type: Number, default: 0 },
  penaltyLockUntil: { type: Date,   default: null },
  lastLoginDate:    { type: Date,   default: null }, // track daily login for miss detection
});

module.exports = mongoose.model("User", userSchema);
