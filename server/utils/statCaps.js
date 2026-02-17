const STAT_CAPS = {
  F:  { str: 20,  sta: 18,  agi: 15 },
  E:  { str: 50,  sta: 45,  agi: 35 },
  D:  { str: 90,  sta: 80,  agi: 60 },
  C:  { str: 150, sta: 130, agi: 100 },
  B:  { str: 250, sta: 220, agi: 170 },
  A:  { str: 400, sta: 350, agi: 270 },
  S:  { str: 700, sta: 600, agi: 450 }
};

function applyStatCap(user, stat, valueToAdd) {

  const caps = STAT_CAPS[user.rank];
  const currentValue = user[stat];
  const maxCap = caps[stat];

  const newValue = currentValue + valueToAdd;

  if (newValue > maxCap) {
    user[stat] = maxCap;
  } else {
    user[stat] = newValue;
  }
}

module.exports = applyStatCap;
