import { useMemo } from 'react'
import { LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES } from '../lib/preloadedFoods'

function StatusBar() {
  return (
    <div style={{
      height: 32, flexShrink: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 22px 0 24px',
      color: '#241a12', fontFamily: '"Nunito", sans-serif', fontWeight: 800,
      fontSize: 14, letterSpacing: 0.2,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#241a12">
          <rect x="0" y="7" width="3" height="4" rx="1"/>
          <rect x="4.5" y="5" width="3" height="6" rx="1"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
          <rect x="13.5" y="0" width="3" height="11" rx="1"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#241a12" opacity="0.5"/>
          <rect x="2" y="2" width="13" height="7" rx="1.2" fill="#241a12"/>
          <rect x="20" y="3.5" width="1.5" height="4" rx="0.75" fill="#241a12" opacity="0.5"/>
        </svg>
      </span>
    </div>
  )
}

export default function HomeScreen({ onOpenCategory }) {
  const { state } = useApp()
  const { signOut } = useAuth()

  const variety = useMemo(
    () => Object.values(state.logs).filter(l => l.reaction !== 'not_tried').length,
    [state.logs]
  )

  const catStats = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catFoods = state.foods.filter(f => f.category === cat.id)
      const total = catFoods.length
      const tried = catFoods.filter(f => {
        const log = state.logs[f.id]
        return log && log.reaction !== 'not_tried'
      }).length
      return { ...cat, tried, total }
    })
  }, [state.foods, state.logs])

  const totalFoods = catStats.reduce((s, c) => s + c.total, 0)

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#fff6ee' }}>
      <StatusBar />
      <div style={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        padding: '4px 17px 26px', gap: 13, overflowY: 'auto',
      }} className="scrollbar-hide">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: '"Baloo 2", sans-serif', fontSize: 28, fontWeight: 800,
            lineHeight: 1, color: '#241a12', whiteSpace: 'nowrap',
          }}>
            Nom Nom
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/hedgehog.png" alt="Nibble the hedgehog" height={56}
              style={{ width: 75, height: 56, objectFit: 'contain', display: 'block' }} />
            <button onClick={signOut}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(36,26,18,0.08)',
                border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70' }}
              aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Variety hero — tap to browse all */}
        <button onClick={() => onOpenCategory('all')}
          style={{
            background: '#241a12', borderRadius: 22, padding: '16px 18px', color: '#fff',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
            transition: 'transform .1s ease',
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ position: 'absolute', right: -16, top: -16, fontSize: 96, opacity: 0.12 }}>🍴</div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 13, color: '#ffb784', letterSpacing: 0.4 }}>ALL</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{variety}</span>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14, opacity: 0.7, whiteSpace: 'nowrap' }}>foods so far</span>
          </div>
          {/* Progress bar */}
          <div style={{ display: 'flex', height: 8, borderRadius: 4, marginTop: 13, overflow: 'hidden', background: 'rgba(255,255,255,0.16)' }}>
            {catStats.map(cat => {
              if (!cat.tried) return null
              return (
                <div key={cat.id} style={{
                  flex: `0 0 ${cat.tried / totalFoods * 100}%`, height: '100%',
                  background: cat.color, transition: 'flex-basis .35s ease',
                }} />
              )
            })}
          </div>
        </button>

        {/* Food groups heading */}
        <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 19, fontWeight: 800, color: '#241a12', flexShrink: 0 }}>
          Food groups
        </div>

        {/* Category grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1, alignContent: 'start' }}>
          {catStats.map(cat => (
            <button key={cat.id} onClick={() => onOpenCategory(cat.id)}
              style={{
                background: cat.color, borderRadius: 20, padding: '12px 13px', color: '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden', minHeight: 104,
                transition: 'transform .1s ease',
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.22)',
                  display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0,
                }}>
                  {cat.emoji}
                </div>
                <span style={{
                  fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 14,
                  background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '2px 8px',
                }}>
                  {cat.tried}/{cat.total}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17, marginTop: 8 }}>
                  {cat.label}
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.28)', marginTop: 5, overflow: 'hidden' }}>
                  <div style={{
                    width: `${cat.total ? cat.tried / cat.total * 100 : 0}%`,
                    height: '100%', background: '#fff', borderRadius: 3, transition: 'width .35s ease',
                  }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
