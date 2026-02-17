function getClassification(user) {
  if (user.str > user.agi && user.str > user.sta)
    return "Power Striker";

  if (user.agi > user.str && user.agi > user.sta)
    return "Speed Technician";

  if (user.sta > user.str && user.sta > user.agi)
    return "Iron Endurance";

  return "Balanced Fighter";
}

module.exports = getClassification;
