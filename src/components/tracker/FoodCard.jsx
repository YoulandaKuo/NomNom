import { Check, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_MAP } from '../../lib/preloadedFoods'

export default function FoodCard({ food }) {
  const { state, dispatch } = useApp()
  const log = state.logs[food.id]
  const tried = log && log.reaction !== 'not_tried'
  const allergic = log?.reaction === 'allergic'
  const cat = CATEGORY_MAP[food.category]

  return (
    <button
      onClick={() => dispatch({ type: 'OPEN_MODAL', foodId: food.id })}
      className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl aspect-square text-center transition-all active:scale-95 shadow-sm border-2"
      style={
        allergic
          ? { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }
          : tried
          ? { backgroundColor: cat.color, borderColor: 'transparent' }
          : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
      }
    >
      {/* Status icon */}
      <div className="flex items-center justify-center w-6 h-6 rounded-full"
        style={{ backgroundColor: tried ? 'rgba(255,255,255,0.3)' : 'transparent' }}
      >
        {allergic
          ? <AlertTriangle size={14} className="text-red-500" />
          : tried
          ? <Check size={14} className="text-white" strokeWidth={3} />
          : null
        }
      </div>

      <span
        className="text-xs font-bold leading-tight line-clamp-2"
        style={{ color: tried && !allergic ? '#fff' : '#475569' }}
      >
        {food.name}
      </span>
    </button>
  )
}
