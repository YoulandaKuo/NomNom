import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../lib/preloadedFoods'

export default function CategoryTabs() {
  const { state, dispatch } = useApp()

  const tabs = [{ id: 'All', label: 'All', emoji: '🍱', color: '#f97316' }, ...CATEGORIES]

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide snap-x">
      {tabs.map(tab => {
        const isActive = state.activeCategory === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_CATEGORY', category: tab.id })}
            className="snap-start flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            style={
              isActive
                ? { backgroundColor: tab.color, color: '#fff' }
                : { backgroundColor: '#f1f5f9', color: '#64748b' }
            }
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
