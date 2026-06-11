import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../lib/preloadedFoods'
import FoodCard from './FoodCard'

function CategorySection({ cat, foods }) {
  const { state, dispatch } = useApp()

  if (foods.length === 0 && cat) return null

  return (
    <div className="px-4 mb-6">
      {cat && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{cat.emoji}</span>
          <h2 className="font-extrabold text-slate-700">{cat.label}</h2>
          <span className="text-xs text-slate-400 font-semibold">{foods.length} foods</span>
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {foods.map(food => <FoodCard key={food.id} food={food} />)}
        {/* Add food tile */}
        <button
          onClick={() => dispatch({ type: 'OPEN_ADD_FOOD', category: cat?.id ?? (state.activeCategory !== 'All' ? state.activeCategory : null) })}
          className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl aspect-square border-2 border-dashed border-slate-300 text-slate-400 hover:border-orange-300 hover:text-orange-400 transition-all active:scale-95"
          aria-label="Add custom food"
        >
          <Plus size={20} />
          <span className="text-xs font-bold">Add</span>
        </button>
      </div>
    </div>
  )
}

export default function FoodGrid() {
  const { state } = useApp()
  const { foods, activeCategory } = state

  const sections = useMemo(() => {
    if (activeCategory === 'All') {
      return CATEGORIES.map(cat => ({
        cat,
        foods: foods.filter(f => f.category === cat.id),
      })).filter(s => s.foods.length > 0)
    }
    return [{
      cat: null,
      foods: foods.filter(f => f.category === activeCategory),
    }]
  }, [foods, activeCategory])

  if (state.loading.foods) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🦔</div>
          <p className="font-bold">Loading foods…</p>
        </div>
      </div>
    )
  }

  if (foods.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="font-bold">No foods yet</p>
          <p className="text-sm mt-1">Connect Supabase to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      {sections.map(({ cat, foods: sectionFoods }) => (
        <CategorySection
          key={cat?.id ?? 'all'}
          cat={cat}
          foods={sectionFoods}
        />
      ))}
      {/* Show add button even when category has 0 foods */}
      {activeCategory !== 'All' && sections[0]?.foods.length === 0 && (
        <CategorySection cat={null} foods={[]} />
      )}
    </div>
  )
}
