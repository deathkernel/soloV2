const difficultyMap = {
  F: 1.0,
  E: 1.1,
  D: 1.2,
  C: 1.3,
  B: 1.4,
  A: 1.6,
  S: 1.8,
  SS: 2.0,
  SSS: 2.3,
  "Shadow Monarch": 2.5
};

const getDifficultyMultiplier = (rank) => {
  return difficultyMap[rank] || 1.0;
};

module.exports = getDifficultyMultiplier;
