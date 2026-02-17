const WORKOUT_POOL = {
  STR: [
    "Standard Push-ups 3x25",
    "Diamond Push-ups 4x15",
    "Decline Push-ups 4x12",
    "Archer Push-ups 4x8",
    "Clap Push-ups 5x5",
    "Bodyweight Squats 4x25",
    "Jump Squats 5x10",
    "Bulgarian Split Squats 4x12",
    "Wall Sit 3x90 sec",
    "Glute Bridges 4x20"
  ],
  AGI: [
    "Forward-Backward Step Drill 3x2min",
    "Lateral Shuffle 3x2min",
    "Pivot Drill 3x2min",
    "Slip Left-Right 4x2min",
    "Bob & Weave 4x2min",
    "Parry Drill 3x2min",
    "Double Slip + Cross 3x1min"
  ],
  STA: [
    "High Knees 30 sec",
    "15 Burpees",
    "Jump Squats x10",
    "Push-ups x10",
    "2km Run",
    "100m Sprint x8",
    "200m Sprint x5"
  ],
  BOXING_BASIC: [
    "Round 1 – Jab only",
    "Round 2 – 1-2 nonstop",
    "Round 3 – 1-2-3",
    "Round 4 – 1-2-slip-2"
  ],
  BOXING_ADVANCED: [
    "Round 5 – 3-2-3 body-head",
    "Round 6 – 1-2-3-2 power",
    "Round 7 – Double jab-cross-hook",
    "Round 8 – Freestyle aggressive"
  ]
};

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateWorkout() {
  const day = new Date().getDay(); // 0 Sunday, 6 Saturday

  if (day === 0) {
    return { rest: true };
  }

  if (day === 6) {
    return {
      advancedBoxing: randomFrom(WORKOUT_POOL.BOXING_ADVANCED)
    };
  }

  return {
    STR: randomFrom(WORKOUT_POOL.STR),
    AGI: randomFrom(WORKOUT_POOL.AGI),
    STA: randomFrom(WORKOUT_POOL.STA),
    BOXING: randomFrom(WORKOUT_POOL.BOXING_BASIC)
  };
}

module.exports = generateWorkout;
