import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../lib/preloadedFoods'

export default function CategorySummary() {
  const { state } = useApp()

  const counts = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catFoods = state.foods.filter(f => f.category === cat.id)
      const tried = catFoods.filter(f => {
        const log = state.logs[f.id]
        return log && log.reaction !== 'not_tried'
      }).length
      return { ...cat, tried, total: catFoods.length }
    })
  }, [state.foods, state.logs])

  if (state.activeCategory !== 'All') return null

  return (
    <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
      {counts.map(cat => (
        <div
          key={cat.id}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{ backgroundColor: cat.color }}
        >
          <span>{cat.emoji}</span>
          <span>{cat.tried}/{cat.total}</span>
        </div>
      ))}
    </div>
  )
}
