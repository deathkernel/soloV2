// classification.js — Hunter class based on dominant stat (SEN included)
function getClassification(user) {
  const str = user.str || 0;
  const agi = user.agi || 0;
  const sta = user.sta || 0;
  const sen = user.sen || 0;

  const max = Math.max(str, agi, sta, sen);

  if (max === 0) return "Unawakened";
  if (sen === max) return "Shadow Sentinel";    // SEN dominant
  if (str === max) return "Power Striker";
  if (agi === max) return "Speed Technician";
  if (sta === max) return "Iron Endurance";

  return "Balanced Fighter";
}

module.exports = getClassification;
