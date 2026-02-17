const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, default: "user" },

  fullName:      { type: String, default: "" },
  email:         { type: String, default: null, sparse: true },   // sparse: allows multiple nulls
  birthdate:     { type: Date,   default: null },
  photo:         { type: String, default: "" },
  licenseNumber: { type: String, default: null, sparse: true },   // sparse: allows multiple nulls

  rank:      { type: String, default: "F" },
  exp:       { type: Number, default: 0 },
  streak:    { type: Number, default: 0 },
  skipCount: { type: Number, default: 0 },

  str: { type: Number, default: 0 },
  agi: { type: Number, default: 0 },
  sta: { type: Number, default: 0 },

  currentWorkout:   { type: Array,   default: [] },
  currentTaskIndex: { type: Number,  default: 0 },
  workoutStarted:   { type: Boolean, default: false },
  lastWorkoutDate:  { type: Date,    default: null },

  missedDaysTotal: { type: Number, default: 0 },
  missedDays30:    { type: Number, default: 0 },
  missedDays7:     { type: Number, default: 0 },
  penaltyLockUntil:{ type: Date,   default: null }
});

module.exports = mongoose.model("User", userSchema);