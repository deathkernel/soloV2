function calculateCP(user) {
  return (
    user.str * 2.5 +
    user.agi * 2.2 +
    user.sta * 1.8
  );
}

function canAccessAdvanced(cp) {
  return cp >= 300;
}

module.exports = { calculateCP, canAccessAdvanced };
