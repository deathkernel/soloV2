export const RANK_THRESHOLDS = [
  { rank: "F",              xp: 0      },
  { rank: "E",              xp: 1542   },
  { rank: "D",              xp: 3855   },
  { rank: "C",              xp: 6940   },
  { rank: "B",              xp: 11567  },
  { rank: "A",              xp: 19279  },
  { rank: "S",              xp: 31618  },
  { rank: "SS",             xp: 53210  },
  { rank: "SSS",            xp: 79815  },
  { rank: "Shadow Monarch", xp: 106420 },
];

export const RANK_THEMES = {
  "F": {
    color:"#9e9e9e", colorDim:"#616161",
    bg:"#08090c", bgPanel:"#0c0c0e",
    border:"rgba(158,158,158,0.25)", borderDim:"rgba(158,158,158,0.08)",
    glow:"rgba(158,158,158,0.3)", gridColor:"rgba(158,158,158,0.04)",
    label:"RANK F — HUNTER", quote:"Every master was once a beginner.",
  },
  "E": {
    color:"#78909c", colorDim:"#546e7a",
    bg:"#08090d", bgPanel:"#0b0d10",
    border:"rgba(120,144,156,0.3)", borderDim:"rgba(120,144,156,0.1)",
    glow:"rgba(120,144,156,0.35)", gridColor:"rgba(120,144,156,0.05)",
    label:"RANK E — AWAKENED", quote:"The gate has opened. Your path begins.",
  },
  "D": {
    color:"#4db6ac", colorDim:"#26a69a",
    bg:"#080d0c", bgPanel:"#0a100f",
    border:"rgba(77,182,172,0.3)", borderDim:"rgba(77,182,172,0.1)",
    glow:"rgba(77,182,172,0.4)", gridColor:"rgba(77,182,172,0.05)",
    label:"RANK D — STRIKER", quote:"You are becoming something the world hasn't seen.",
  },
  "C": {
    color:"#4fc3f7", colorDim:"#0288d1",
    bg:"#08090f", bgPanel:"#0c0e1a",
    border:"rgba(79,195,247,0.35)", borderDim:"rgba(79,195,247,0.12)",
    glow:"rgba(79,195,247,0.45)", gridColor:"rgba(79,195,247,0.05)",
    label:"RANK C — ELITE HUNTER", quote:"The system acknowledges your growth.",
  },
  "B": {
    color:"#7986cb", colorDim:"#5c6bc0",
    bg:"#09090f", bgPanel:"#0d0d18",
    border:"rgba(121,134,203,0.35)", borderDim:"rgba(121,134,203,0.12)",
    glow:"rgba(121,134,203,0.45)", gridColor:"rgba(121,134,203,0.05)",
    label:"RANK B — ADVANCED HUNTER", quote:"Fear is a luxury you can no longer afford.",
  },
  "A": {
    color:"#ef5350", colorDim:"#c62828",
    bg:"#0f0808", bgPanel:"#160b0b",
    border:"rgba(239,83,80,0.35)", borderDim:"rgba(239,83,80,0.12)",
    glow:"rgba(239,83,80,0.5)", gridColor:"rgba(239,83,80,0.05)",
    label:"RANK A — SOVEREIGN", quote:"You walk where others fear to tread.",
  },
  "S": {
    color:"#ffd54f", colorDim:"#f9a825",
    bg:"#0f0d04", bgPanel:"#161200",
    border:"rgba(255,213,79,0.4)", borderDim:"rgba(255,213,79,0.13)",
    glow:"rgba(255,213,79,0.55)", gridColor:"rgba(255,213,79,0.05)",
    label:"RANK S — NATIONAL LEVEL", quote:"Nations tremble at the mention of your name.",
  },
  "SS": {
    color:"#ff8a65", colorDim:"#e64a19",
    bg:"#0f0905", bgPanel:"#160c06",
    border:"rgba(255,138,101,0.4)", borderDim:"rgba(255,138,101,0.13)",
    glow:"rgba(255,138,101,0.55)", gridColor:"rgba(255,138,101,0.05)",
    label:"RANK SS — CONTINENTAL", quote:"You are no longer bound by human limits.",
  },
  "SSS": {
    color:"#ce93d8", colorDim:"#9c27b0",
    bg:"#0c0810", bgPanel:"#130a18",
    border:"rgba(206,147,216,0.4)", borderDim:"rgba(206,147,216,0.13)",
    glow:"rgba(206,147,216,0.55)", gridColor:"rgba(206,147,216,0.05)",
    label:"RANK SSS — TRANSCENDENT", quote:"The hunters now hunt alongside legends.",
  },
  "Shadow Monarch": {
    color:"#7c4dff", colorDim:"#4527a0",
    bg:"#03020a", bgPanel:"#07041a",
    border:"rgba(124,77,255,0.5)", borderDim:"rgba(124,77,255,0.15)",
    glow:"rgba(124,77,255,0.7)", gridColor:"rgba(124,77,255,0.08)",
    label:"SHADOW MONARCH", quote:"I alone level up.",
  },
};

export function getTheme(rank) {
  return RANK_THEMES[rank] || RANK_THEMES["F"];
}

export function getNextRankThreshold(rank) {
  const idx = RANK_THRESHOLDS.findIndex(r => r.rank === rank);
  return RANK_THRESHOLDS[idx + 1] || null;
}