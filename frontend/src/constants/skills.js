export const SKILLS = [
  "medical",
  "food",
  "logistics",
  "rescue",
  "translation",
  "counseling",
];

/* ================= HELPERS ================= */

// 🔥 normalize any skill input
export const normalizeSkill = (skill) =>
  skill?.toLowerCase().trim();

// 🔥 validate skill exists
export const isValidSkill = (skill) =>
  SKILLS.includes(normalizeSkill(skill));