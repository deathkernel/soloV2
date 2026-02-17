const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema({

  // ── XP per task type ─────────────────────────────────────
  xpRewards: {
    STR:    { type: Number, default: 20 },
    AGI:    { type: Number, default: 20 },
    STA:    { type: Number, default: 20 },
    SEN:    { type: Number, default: 20 },
    BOXING: { type: Number, default: 25 },
    REST:   { type: Number, default: 10 },
  },

  // ── CP formula weights ────────────────────────────────────
  cpWeights: {
    str: { type: Number, default: 2.5 },
    agi: { type: Number, default: 2.2 },
    sta: { type: Number, default: 1.8 },
    sen: { type: Number, default: 1.5 },
  },

  // ── Rank XP thresholds ────────────────────────────────────
  rankThresholds: {
    type: [{ rank: String, xp: Number }],
    default: [
      { rank: "F",              xp: 0      },
      { rank: "E",              xp: 1542   },
      { rank: "D",              xp: 3855   },
      { rank: "C",              xp: 6940   },
      { rank: "B",              xp: 11567  },
      { rank: "A",              xp: 19279  },
      { rank: "S",              xp: 31618  },
      { rank: "SS",             xp: 53210  },
      { rank: "SSS",            xp: 79815  },
      { rank: "Shadow Monarch", xp: 106420 },
    ]
  },

  // ── Stat caps per rank ────────────────────────────────────
  statCaps: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      F:  { str: 20,  agi: 15,  sta: 18  },
      E:  { str: 50,  agi: 35,  sta: 45  },
      D:  { str: 90,  agi: 60,  sta: 80  },
      C:  { str: 150, agi: 100, sta: 130 },
      B:  { str: 250, agi: 170, sta: 220 },
      A:  { str: 400, agi: 270, sta: 350 },
      S:  { str: 700, agi: 450, sta: 600 },
    }
  },

}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);