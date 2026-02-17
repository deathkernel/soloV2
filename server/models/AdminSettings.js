const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema({
  xpPerWorkout: { type: Number, default: 100 },
  rankThresholds: [
    {
      name: String,
      xp: Number
    }
  ]
});

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);
