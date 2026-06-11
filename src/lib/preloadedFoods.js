export const CATEGORIES = [
  { id: 'Fruits',     label: 'Fruits',     emoji: '🍓', color: '#ff7d24', dk: '#e8650f', tint: '#fff1e3' },
  { id: 'Vegetables', label: 'Vegetables', emoji: '🥦', color: '#16a34a', dk: '#0f8040', tint: '#e8f7ee' },
  { id: 'Grains',     label: 'Grains',     emoji: '🌾', color: '#f5a300', dk: '#d98c00', tint: '#fff4d9' },
  { id: 'Protein',    label: 'Protein',    emoji: '🍗', color: '#ec4d3f', dk: '#cf372b', tint: '#fdeae8' },
  { id: 'Dairy',      label: 'Dairy',      emoji: '🧀', color: '#3b82f6', dk: '#2667c4', tint: '#e9f0ff' },
  { id: 'Others',     label: 'Others',     emoji: '🥣', color: '#7c3aed', dk: '#5b21b6', tint: '#efe9fd' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export const REACTIONS = [
  { value: 'loved',     label: 'Loved it',      emoji: '😍', color: '#22c55e' },
  { value: 'meh',       label: 'Meh',           emoji: '😕', color: '#f5a300' },
  { value: 'neutral',   label: 'Neutral',       emoji: '😐', color: '#94a3b8' },
  { value: 'tried',     label: 'Tried',         emoji: '✅', color: '#ff7d24' },
  { value: 'allergic',  label: 'Allergic',      emoji: '🚨', color: '#ef4444' },
  { value: 'not_tried', label: 'Not tried yet', emoji: '💤', color: '#e2e8f0' },
]

export const REACTION_MAP = Object.fromEntries(REACTIONS.map(r => [r.value, r]))

// Moods offered in the food detail sheet ('tried' = tried with no mood logged,
// 'allergic' is kept above so legacy logs still render)
export const MOODS = ['loved', 'meh', 'neutral']

export const MILESTONES = [
  { count: 5,   message: "Hoji is paying attention! 👀" },
  { count: 10,  message: "Hoji is impressed! 🦔✨" },
  { count: 20,  message: "Hoji is cheering you on! 🎉" },
  { count: 50,  message: "Hoji is doing a happy dance! 🕺" },
  { count: 100, message: "Hoji has fainted from joy! 💫" },
]
