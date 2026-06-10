import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CATEGORY_MAP } from '../lib/preloadedFoods'
import FoodCard from '../components/tracker/FoodCard'

const ALL_META = { label: 'All foods', emoji: '🍴', color: '#241a12', dk: '#1a120b', tint: '#f3ece2' }

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7"/>
    </svg>
  )
}

function StatusBar({ color }) {
  return (
    <div style={{
      height: 32, flexShrink: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 22px 0 24px',
      background: color, color: '#fff',
      fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 14, letterSpacing: 0.2,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff">
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="4.5" y="5" width="3" height="6" rx="1"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="11" rx="1"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#fff" opacity="0.7"/>
          <rect x="2" y="2" width="13" height="7" rx="1.2" fill="#fff"/>
          <rect x="20" y="3.5" width="1.5" height="4" rx="0.75" fill="#fff" opacity="0.7"/>
        </svg>
      </span>
    </div>
  )
}

export default function CategoryScreen({ category, onBack }) {
  const { state, dispatch } = useApp()
  const isAll = category === 'all'
  const m = isAll ? ALL_META : (CATEGORY_MAP[category] ?? ALL_META)

  const allFoods = useMemo(() => {
    if (isAll) return state.foods
    return state.foods.filter(f => f.category === category)
  }, [state.foods, category, isAll])

  const tried = allFoods.filter(f => {
    const log = state.logs[f.id]
    return log && log.reaction !== 'not_tried'
  }).length
  const total = allFoods.length
  const toGo = total - tried

  const sections = useMemo(() => {
    if (!isAll) return [{ cat: null, foods: allFoods }]
    return CATEGORIES.map(cat => ({
      cat,
      foods: state.foods.filter(f => f.category === cat.id),
    }))
  }, [isAll, allFoods, state.foods])

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#fff6ee' }}>
      <StatusBar color={m.color} />

      {/* Colour-block header */}
      <div style={{ background: m.color, padding: '4px 18px 18px', color: '#fff', borderRadius: '0 0 26px 26px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} aria-label="Back"
            style={{
              width: 38, height: 38, borderRadius: 13, background: 'rgba(255,255,255,0.22)',
              display: 'grid', placeItems: 'center', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0,
            }}>
            <BackIcon />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
              {m.label} {m.emoji}
            </div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 13, opacity: 0.9 }}>
              {tried} of {total} tried · {toGo} to go
            </div>
          </div>
        </div>
        {!isAll && (
          <div style={{ display: 'flex', height: 8, borderRadius: 4, marginTop: 13, overflow: 'hidden', background: 'rgba(255,255,255,0.3)' }}>
            {tried > 0 && (
              <div style={{ flex: `0 0 ${tried / total * 100}%`, height: '100%', background: '#fff', transition: 'flex-basis .35s ease' }} />
            )}
          </div>
        )}
      </div>

      {/* Food grid */}
      <div style={{ flex: 1, minHeight: 0, padding: '14px 16px 26px', overflowY: 'auto' }} className="scrollbar-hide">
        {isAll ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sections.map(({ cat, foods }) => {
              const catTried = foods.filter(f => {
                const log = state.logs[f.id]
                return log && log.reaction !== 'not_tried'
              }).length
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 16, color: '#241a12' }}>{cat.label}</span>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70' }}>{catTried}/{foods.length}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
                    {foods.map(food => (
                      <FoodCard key={food.id} food={food} onOpen={() => dispatch({ type: 'OPEN_MODAL', foodId: food.id })} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
            {allFoods.map(food => (
              <FoodCard key={food.id} food={food} onOpen={() => dispatch({ type: 'OPEN_MODAL', foodId: food.id })} />
            ))}
            {/* Add food tile */}
            <button
              onClick={() => dispatch({ type: 'OPEN_ADD_FOOD' })}
              style={{
                borderRadius: 18, padding: '12px 6px 9px', textAlign: 'center', cursor: 'pointer',
                background: '#fff', border: '2px dashed #e2d4c4', opacity: 0.8,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                minHeight: 96,
              }}>
              <span style={{ fontSize: 22 }}>➕</span>
              <span style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 12, color: '#8a7d70' }}>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
