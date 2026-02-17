const RANKS = [
  { name: "F", multiplier: 1 },
  { name: "E", multiplier: 1.1 },
  { name: "D", multiplier: 1.2 },
  { name: "C", multiplier: 1.3 },
  { name: "B", multiplier: 1.5 },
  { name: "A", multiplier: 1.7 },
  { name: "S", multiplier: 2 }
];

function getRankMultiplier(rank) {
  const r = RANKS.find(r => r.name === rank);
  return r ? r.multiplier : 1;
}

function calculateCombatPower(user) {

  const STR = user.str;
  const AGI = user.agi;
  const STA = user.sta;

  const basePower =
    (STR * 1.2) +
    (AGI * 1.1) +
    (STA * 1.3);

  const highest = Math.max(STR, AGI, STA);
  const lowest = Math.min(STR, AGI, STA);

  let balanceFactor = 1;

  if (highest > 0) {
    balanceFactor = 1 + ((lowest / highest) * 0.2);
  }

  const rankMultiplier = getRankMultiplier(user.rank);

  const combatPower =
    basePower *
    balanceFactor *
    rankMultiplier;

  return Math.round(combatPower);
}

module.exports = calculateCombatPower;
