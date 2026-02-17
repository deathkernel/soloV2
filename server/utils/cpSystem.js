// cpSystem.js — Combat Power calculation (SEN included)
function calculateCP(user) {
  return Math.round(
    (user.str || 0) * 2.5 +
    (user.agi || 0) * 2.2 +
    (user.sta || 0) * 1.8 +
    (user.sen || 0) * 1.5  // SEN contributes to CP
  );
}

function canAccessAdvanced(cp) {
  return cp >= 300;
}

module.exports = { calculateCP, canAccessAdvanced };
