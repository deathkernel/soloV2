// penaltyEngine.js — Detects missed days and applies penalties
const { getRankFromXP } = require("./rankSystem");

const RANK_ORDER = ["F","E","D","C","B","A","S","SS","SSS","Shadow Monarch"];

/**
 * Check if user missed yesterday's workout and apply penalties.
 * Called on every /session or /profile request.
 * Returns { penaltyApplied, details } for frontend notification.
 */
async function checkAndApplyPenalty(user) {
  const now = new Date();
  const today = now.toDateString();

  // Nothing to check on first ever login
  if (!user.lastLoginDate) {
    user.lastLoginDate = now;
    return { penaltyApplied: false };
  }

  const lastLogin = new Date(user.lastLoginDate);
  const lastLoginDay = lastLogin.toDateString();

  // Already checked today
  if (lastLoginDay === today) {
    return { penaltyApplied: false };
  }

  // Update login date first
  user.lastLoginDate = now;

  // Calculate how many days were missed
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((now - lastLogin) / msPerDay);

  // daysDiff === 1 means yesterday was the last login — no miss
  // daysDiff >= 2 means at least one day was skipped
  const missedDays = Math.max(0, daysDiff - 1);

  if (missedDays === 0) {
    return { penaltyApplied: false };
  }

  // Check if workout was actually completed yesterday
  const yesterdayStr = new Date(now - msPerDay).toDateString();
  const lastWorkoutDay = user.lastWorkoutDate
    ? new Date(user.lastWorkoutDate).toDateString()
    : null;

  // If yesterday's workout WAS completed — no penalty
  if (lastWorkoutDay === yesterdayStr) {
    return { penaltyApplied: false };
  }

  // ── APPLY PENALTY ──────────────────────────────────────────────────────────
  const details = [];

  // Accumulate missed counters
  user.missedDaysTotal = (user.missedDaysTotal || 0) + missedDays;
  user.missedDays30    = (user.missedDays30 || 0)    + missedDays;
  user.missedDays7     = (user.missedDays7  || 0)    + missedDays;

  // Reset streak
  if (user.streak > 0) {
    details.push(`STREAK RESET from ${user.streak} days`);
    user.streak = 0;
  }

  // TIER 1: -10 EXP, -1 all stats per missed day
  const expLoss = 10 * missedDays;
  user.exp = Math.max(0, (user.exp || 0) - expLoss);
  user.str = Math.max(0, (user.str || 0) - missedDays);
  user.agi = Math.max(0, (user.agi || 0) - missedDays);
  user.sta = Math.max(0, (user.sta || 0) - missedDays);
  user.sen = Math.max(0, (user.sen || 0) - missedDays);
  details.push(`-${expLoss} EXP, -${missedDays} ALL STATS`);

  // TIER 2: 3+ consecutive violations → 30% difficulty increase flag + 2-day lock
  if (user.missedDays7 >= 3) {
    const lockUntil = new Date(now);
    lockUntil.setDate(lockUntil.getDate() + 2);
    user.penaltyLockUntil = lockUntil;
    details.push("PENALTY LOCK: 2 days — severe violation");
  }

  // TIER 3: 30 skips in 30 days → rank demotion
  if (user.missedDays30 >= 30) {
    const currentIdx = RANK_ORDER.indexOf(user.rank);
    if (currentIdx > 0) {
      const oldRank = user.rank;
      user.rank = RANK_ORDER[currentIdx - 1];
      details.push(`RANK DEMOTION: ${oldRank} → ${user.rank}`);
    }
    user.missedDays30 = 0; // reset 30-day counter after demotion
  }

  // Re-check rank from XP after EXP loss (might drop rank)
  const recalcRank = getRankFromXP(user.exp);
  if (RANK_ORDER.indexOf(recalcRank.rank) < RANK_ORDER.indexOf(user.rank)) {
    user.rank = recalcRank.rank;
    details.push(`RANK ADJUSTED TO ${user.rank} based on XP`);
  }

  return {
    penaltyApplied: true,
    missedDays,
    details,
    expLoss,
  };
}

module.exports = { checkAndApplyPenalty };
