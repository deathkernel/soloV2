const calculateRank = require("./rankCalculator");
const AdminSettings = require("../models/AdminSettings");

const applyMissPenalty = async (user) => {

  user.streak = 0;

  user.missedDaysTotal += 1;
  user.missedDays30 += 1;
  user.missedDays7 += 1;

  // TIER 1
  if (user.missedDays7 === 1) {
    const xpLoss = Math.round(user.xp * 0.05);
    user.xp = Math.max(0, user.xp - xpLoss);

    user.str = Math.max(0, user.str - 1);
    user.agi = Math.max(0, user.agi - 1);
    user.sta = Math.max(0, user.sta - 1);
  }

  // TIER 2
  if (user.missedDays7 >= 3) {
    const xpLoss = Math.round(user.xp * 0.10);
    user.xp = Math.max(0, user.xp - xpLoss);

    user.str = Math.max(0, user.str - 2);
    user.agi = Math.max(0, user.agi - 2);
    user.sta = Math.max(0, user.sta - 2);

    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + 2);
    user.penaltyLockUntil = lockUntil;
  }

  // TIER 3
  if (user.missedDays30 >= 7) {

    const settings = await AdminSettings.findOne();
    const ranks = settings.rankThresholds;

    const currentIndex = ranks.findIndex(r => r.name === user.rank);

    if (currentIndex > 0) {
      const previousRank = ranks[currentIndex - 1];

      user.rank = previousRank.name;
      user.xp = previousRank.xp;

      user.str = Math.max(0, user.str - 5);
      user.agi = Math.max(0, user.agi - 5);
      user.sta = Math.max(0, user.sta - 5);
    }

    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + 3);
    user.penaltyLockUntil = lockUntil;

    user.missedDays30 = 0;
  }

  user.rank = await calculateRank(user.xp);
};

module.exports = applyMissPenalty;
