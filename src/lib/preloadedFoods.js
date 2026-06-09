export const CATEGORIES = [
  { id: 'Fruits',     label: 'Fruits',     emoji: '🍎', color: '#f97316' },
  { id: 'Vegetables', label: 'Vegetables', emoji: '🥦', color: '#22c55e' },
  { id: 'Grains',     label: 'Grains',     emoji: '🌾', color: '#eab308' },
  { id: 'Protein',    label: 'Protein',    emoji: '🍗', color: '#ef4444' },
  { id: 'Dairy',      label: 'Dairy',      emoji: '🥛', color: '#3b82f6' },
  { id: 'Others',     label: 'Others',     emoji: '✨', color: '#a855f7' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export const REACTIONS = [
  { value: 'loved',     label: 'Loved it',     emoji: '😍', color: '#22c55e' },
  { value: 'neutral',   label: 'Neutral',       emoji: '😐', color: '#94a3b8' },
  { value: 'allergic',  label: 'Allergic',      emoji: '🚨', color: '#ef4444' },
  { value: 'not_tried', label: 'Not tried yet', emoji: '💤', color: '#e2e8f0' },
]

export const REACTION_MAP = Object.fromEntries(REACTIONS.map(r => [r.value, r]))

export const MILESTONES = [
  { count: 5,   message: "Hoji is paying attention! 👀" },
  { count: 10,  message: "Hoji is impressed! 🦔✨" },
  { count: 20,  message: "Hoji is cheering you on! 🎉" },
  { count: 50,  message: "Hoji is doing a happy dance! 🕺" },
  { count: 100, message: "Hoji has fainted from joy! 💫" },
]
