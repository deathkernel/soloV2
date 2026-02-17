/**
 * RANK SYSTEM — Single source of truth
 * S rank = 2 years of perfect daily training
 * Shadow Monarch = 5 years total
 *
 * Daily max XP = 85 (STR:20 + AGI:20 + STA:20 + BOXING:25)
 * Work days/year = 313 (365 - 52 rest days)
 * XP/year = 85 * 313 = 26,605
 */

const RANK_THRESHOLDS = [
  { rank: "F",              xp: 0,      color: "#9e9e9e", glow: "#9e9e9e", bg: "#0c0c0c" },
  { rank: "E",              xp: 1542,   color: "#78909c", glow: "#78909c", bg: "#090c0e" },
  { rank: "D",              xp: 3855,   color: "#4db6ac", glow: "#4db6ac", bg: "#09100f" },
  { rank: "C",              xp: 6940,   color: "#4fc3f7", glow: "#4fc3f7", bg: "#08090f" },
  { rank: "B",              xp: 11567,  color: "#7986cb", glow: "#7986cb", bg: "#09090f" },
  { rank: "A",              xp: 19279,  color: "#ef5350", glow: "#ef5350", bg: "#100909" },
  { rank: "S",              xp: 31618,  color: "#ffd54f", glow: "#ffd54f", bg: "#100e05" },
  { rank: "SS",             xp: 53210,  color: "#ff8a65", glow: "#ff8a65", bg: "#100a05" },
  { rank: "SSS",            xp: 79815,  color: "#ce93d8", glow: "#ce93d8", bg: "#0e090f" },
  { rank: "Shadow Monarch", xp: 106420, color: "#1a1a2e", glow: "#7c4dff", bg: "#05030d" },
];

/**
 * Get rank object from XP value
 */
function getRankFromXP(xp) {
  let current = RANK_THRESHOLDS[0];
  for (const r of RANK_THRESHOLDS) {
    if (xp >= r.xp) current = r;
    else break;
  }
  return current;
}

/**
 * Get next rank threshold
 */
function getNextRank(currentRankName) {
  const idx = RANK_THRESHOLDS.findIndex(r => r.rank === currentRankName);
  return RANK_THRESHOLDS[idx + 1] || null;
}

module.exports = { RANK_THRESHOLDS, getRankFromXP, getNextRank };