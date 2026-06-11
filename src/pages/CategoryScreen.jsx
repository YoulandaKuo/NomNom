import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, CATEGORY_MAP } from '../lib/preloadedFoods'
import FoodCard from '../components/tracker/FoodCard'

const ALL_META = { label: 'All foods', emoji: '🍴', color: '#241a12', dk: '#1a120b', tint: '#f3ece2' }

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7"/>
    </svg>
  )
}

function ProgressBar({ tried, total, color }) {
  return (
    <div style={{ height: 8, borderRadius: 4, background: '#eddfc9', overflow: 'hidden' }}>
      <div style={{ width: `${tried / total * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .35s ease' }} />
    </div>
  )
}

function FilterTabs({ filter, setFilter, tried, total, color, dk, tint }) {
  const tabs = [
    { key: 'all',   label: 'All',      count: total },
    { key: 'tried', label: 'Tried',    count: tried },
    { key: 'new',   label: 'Not yet',  count: total - tried },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {tabs.map(({ key, label, count }) => {
        const active = filter === key
        return (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 11px', borderRadius: 12,
              background: active ? tint : 'transparent',
              fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14,
              color: active ? dk : '#8a7d70',
              border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: active ? color : '#ddd' }} />
            {label}
            <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 13 }}>{count}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function CategoryScreen({ category, onBack }) {
  const { state, dispatch } = useApp()
  const [filter, setFilter] = useState('all')
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

  const filteredFoods = useMemo(() => {
    if (filter === 'tried') return allFoods.filter(f => { const l = state.logs[f.id]; return l && l.reaction !== 'not_tried' })
    if (filter === 'new')   return allFoods.filter(f => { const l = state.logs[f.id]; return !l || l.reaction === 'not_tried' })
    return allFoods
  }, [allFoods, filter, state.logs])

  const sections = useMemo(() => {
    if (!isAll) return [{ cat: null, foods: filteredFoods }]
    return CATEGORIES.map(cat => ({
      cat,
      foods: state.foods.filter(f => {
        if (f.category !== cat.id) return false
        if (filter === 'tried') { const l = state.logs[f.id]; return l && l.reaction !== 'not_tried' }
        if (filter === 'new')   { const l = state.logs[f.id]; return !l || l.reaction === 'not_tried' }
        return true
      }),
    })).filter(s => s.foods.length > 0)
  }, [isAll, filteredFoods, state.foods, state.logs, filter])

  const openFood = (foodId) => dispatch({ type: 'OPEN_MODAL', foodId })
  const addFood  = () => dispatch({ type: 'OPEN_ADD_FOOD', category: isAll ? null : category })

  // ── shared grid ──────────────────────────────────────────────────
  function FoodGrid({ foods, cols = 3 }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 11 }}>
        {foods.map(food => (
          <FoodCard key={food.id} food={food} onOpen={() => openFood(food.id)} />
        ))}
        {!isAll && filter === 'all' && (
          <button onClick={addFood}
            style={{
              borderRadius: 18, padding: '12px 6px 9px', textAlign: 'center', cursor: 'pointer',
              background: '#fff', border: '2px dashed #e2d4c4', opacity: 0.8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              minHeight: 96,
            }}>
            <span style={{ fontSize: 22 }}>➕</span>
            <span style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 12, color: '#8a7d70' }}>Add</span>
          </button>
        )}
      </div>
    )
  }

  function AllSections({ cols }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sections.map(({ cat, foods }) => {
          const catTried = foods.filter(f => { const l = state.logs[f.id]; return l && l.reaction !== 'not_tried' }).length
          return (
            <div key={cat.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                <span style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 16, color: '#241a12' }}>{cat.label}</span>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70' }}>{catTried}/{state.foods.filter(f => f.category === cat.id).length}</span>
              </div>
              <FoodGrid foods={foods} cols={cols} />
            </div>
          )
        })}
      </div>
    )
  }

  // ── MOBILE layout (< 700px) ──────────────────────────────────────
  const mobileLayout = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Ghost nav header */}
      <div style={{ padding: '10px 18px 16px', flexShrink: 0 }}>
        <button onClick={onBack} aria-label="Back to Food groups"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8a7d70', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          <BackIcon />
          <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14 }}>Food groups</span>
        </button>

        <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 32, fontWeight: 800, lineHeight: 1, color: '#241a12' }}>
          {m.label} {m.emoji}
        </div>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14, color: '#8a7d70', marginTop: 5 }}>
          {tried} of {total} tried · {toGo} to go
        </div>
        {!isAll && (
          <div style={{ marginTop: 12 }}>
            <ProgressBar tried={tried} total={total} color={m.color} />
          </div>
        )}

        {/* Filter tabs — horizontal on mobile */}
        {!isAll && (
          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {[['all', 'All', total], ['tried', 'Tried', tried], ['new', 'Not yet', toGo]].map(([key, label, count]) => {
              const active = filter === key
              return (
                <button key={key} onClick={() => setFilter(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 20,
                    background: active ? m.tint : 'rgba(36,26,18,0.06)',
                    fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13,
                    color: active ? m.dk : '#8a7d70',
                    border: 'none', cursor: 'pointer',
                  }}>
                  {label}
                  <span style={{ fontWeight: 800, fontSize: 12 }}>{count}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Food grid */}
      <div style={{ flex: 1, padding: '4px 16px 32px', overflowY: 'auto', boxSizing: 'border-box' }} className="scrollbar-hide">
        {isAll ? <AllSections cols={3} /> : <FoodGrid foods={filteredFoods} cols={3} />}
      </div>
    </div>
  )

  // ── DESKTOP layout (≥ 700px) ─────────────────────────────────────
  const desktopLayout = (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* Left sidebar */}
      <div style={{
        width: 220, flexShrink: 0, padding: '28px 20px 32px 28px',
        display: 'flex', flexDirection: 'column',
        borderRight: '1.5px solid rgba(36,26,18,0.07)',
        overflowY: 'auto',
      }} className="scrollbar-hide">
        <button onClick={onBack} aria-label="Back to Food groups"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8a7d70', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 22 }}>
          <BackIcon />
          <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14 }}>Food groups</span>
        </button>

        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>{m.emoji}</div>
        <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 28, fontWeight: 800, lineHeight: 1.1, color: '#241a12', marginBottom: 5 }}>{m.label}</div>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, color: '#8a7d70', marginBottom: 11 }}>
          {tried} of {total} tried
        </div>
        {!isAll && <ProgressBar tried={tried} total={total} color={m.color} />}

        {/* Filter tabs — vertical on desktop */}
        <div style={{ marginTop: 24 }}>
          <FilterTabs
            filter={filter} setFilter={setFilter}
            tried={tried} total={total}
            color={m.color} dk={m.dk} tint={m.tint}
          />
        </div>
      </div>

      {/* Food grid — 4 cols on desktop */}
      <div style={{ flex: 1, padding: '28px 28px 32px', overflowY: 'auto' }} className="scrollbar-hide">
        {isAll ? <AllSections cols={4} /> : <FoodGrid foods={filteredFoods} cols={4} />}
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Responsive switch */}
      <style>{`
        .cat-mobile { display: flex; flex-direction: column; flex: 1; min-height: 0; }
        .cat-desktop { display: none; }
        @media (min-width: 700px) {
          .cat-mobile { display: none; }
          .cat-desktop { display: flex; flex: 1; min-height: 0; }
        }
      `}</style>
      <div className="cat-mobile">{mobileLayout}</div>
      <div className="cat-desktop">{desktopLayout}</div>
    </div>
  )
}
