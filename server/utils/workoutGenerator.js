// workoutGenerator.js — Generates daily workout with SEN exercises

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
    "High Knees 30 sec x5",
    "15 Burpees",
    "Jump Squats x10",
    "Push-ups x10",
    "2km Run",
    "100m Sprint x8",
    "200m Sprint x5"
  ],
  SEN: [
    "Plank Hold 3x60 sec",
    "Single-Leg Balance 3x45 sec each",
    "Defensive Reaction Drill 3x2min",
    "Eyes-closed Balance 2x30 sec",
    "Mirror Shadowbox (slow motion) 3x2min",
    "Breathing Focus + Core Brace 3x60 sec",
    "Bear Crawl (control focus) 4x15m"
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

// Automated task pool (high-priority missions)
const AUTO_TASK_POOL = [
  { tag: "STR", desc: "100 Push-ups — any style, non-stop grind", xp: 50, stat: "str" },
  { tag: "AGI", desc: "10-minute footwork circuit — full intensity", xp: 50, stat: "agi" },
  { tag: "STA", desc: "5km Run — push past your limit", xp: 60, stat: "sta" },
  { tag: "SEN", desc: "20-minute meditation + breathing control", xp: 45, stat: "sen" },
  { tag: "STR", desc: "200 Squats — power through fatigue", xp: 55, stat: "str" },
  { tag: "AGI", desc: "Speed ladder drill — 15 minutes nonstop", xp: 50, stat: "agi" },
  { tag: "STA", desc: "30-minute jog at steady pace", xp: 55, stat: "sta" },
  { tag: "SEN", desc: "Plank 5 minutes total — focus and stillness", xp: 45, stat: "sen" },
  { tag: "STR", desc: "50 Pull-ups — any grip, any set split", xp: 60, stat: "str" },
  { tag: "STA", desc: "500 Jump rope skips — no rest", xp: 50, stat: "sta" },
];

// Surprise quest pool
const SURPRISE_QUEST_POOL = [
  { category: "Combat",    desc: "Shadow box for 5 minutes straight — no stopping",  xp: 40, stat: "agi",  duration: 300 },
  { category: "Strength",  desc: "50 Push-ups right now — drop and go",              xp: 35, stat: "str",  duration: 600 },
  { category: "Endurance", desc: "Run 1km as fast as you can",                       xp: 45, stat: "sta",  duration: 900 },
  { category: "Skill",     desc: "3-minute plank hold — do not break",               xp: 35, stat: "sen",  duration: 300 },
  { category: "Combat",    desc: "100 jabs — alternate hands, full extension",       xp: 40, stat: "agi",  duration: 600 },
  { category: "Strength",  desc: "30 Burpees — maximum effort",                      xp: 50, stat: "str",  duration: 600 },
  { category: "Endurance", desc: "Hold wall sit for 3 minutes",                      xp: 35, stat: "sta",  duration: 300 },
  { category: "Skill",     desc: "Single-leg balance: 2 min each side",              xp: 30, stat: "sen",  duration: 300 },
  { category: "Boss",      desc: "⚠ BOSS QUEST: 200 reps (any exercise) — 10 min", xp: 80, stat: "str",  duration: 600 },
  { category: "Boss",      desc: "⚠ BOSS QUEST: 2km sprint — absolute limit",       xp: 80, stat: "sta",  duration: 1200 },
];

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateWorkout() {
  const day = new Date().getDay(); // 0=Sun, 6=Sat

  if (day === 0) return { rest: true };

  if (day === 6) {
    return { advancedBoxing: randomFrom(WORKOUT_POOL.BOXING_ADVANCED) };
  }

  return {
    STR:    randomFrom(WORKOUT_POOL.STR),
    AGI:    randomFrom(WORKOUT_POOL.AGI),
    STA:    randomFrom(WORKOUT_POOL.STA),
    SEN:    randomFrom(WORKOUT_POOL.SEN),   // NEW SEN task
    BOXING: randomFrom(WORKOUT_POOL.BOXING_BASIC),
  };
}

/**
 * 30% chance to generate an automated high-priority task
 */
function generateAutomatedTask() {
  if (Math.random() > 0.30) return null;
  return { ...randomFrom(AUTO_TASK_POOL) };
}

/**
 * Generate a random surprise quest
 */
function generateSurpriseQuest() {
  return { ...randomFrom(SURPRISE_QUEST_POOL) };
}

module.exports = { generateWorkout, generateAutomatedTask, generateSurpriseQuest };
