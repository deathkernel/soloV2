const AdminSettings = require("../models/AdminSettings");

const calculateRank = async (xp) => {
  const settings = await AdminSettings.findOne();

  if (!settings) return "F";

  let currentRank = "F";

  settings.rankThresholds.forEach((rank) => {
    if (xp >= rank.xp) {
      currentRank = rank.name;
    }
  });

  return currentRank;
};

module.exports = calculateRank;
