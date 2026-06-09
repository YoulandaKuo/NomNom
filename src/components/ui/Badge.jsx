import { REACTION_MAP } from '../../lib/preloadedFoods'

export default function Badge({ reaction }) {
  const r = REACTION_MAP[reaction]
  if (!r) return null
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: r.color }}
    >
      {r.emoji} {r.label}
    </span>
  )
}
