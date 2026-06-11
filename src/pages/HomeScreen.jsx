import { useMemo, useState, useEffect, useRef } from 'react'
import { LogOut, MoreVertical, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES } from '../lib/preloadedFoods'

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
  padding: '10px 12px', borderRadius: 11, border: 'none', cursor: 'pointer',
  background: 'transparent', textAlign: 'left',
  fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
  transition: 'background .12s ease',
}

export default function HomeScreen({ onOpenCategory, onOpenSettings }) {
  const { state } = useApp()
  const { signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 600, width: '100%', margin: '0 auto', padding: '16px 17px 32px', gap: 13 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="/hedgehog.png" alt="Nibble the hedgehog"
            style={{ width: 60, height: 45, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 28, fontWeight: 800, lineHeight: 1, color: '#241a12', transform: 'translateY(4px)' }}>
            Nom Nom
          </div>
        </div>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(36,26,18,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70' }}
            aria-label="More options" aria-haspopup="menu" aria-expanded={menuOpen}>
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div role="menu"
              style={{
                position: 'absolute', top: 42, right: 0, minWidth: 168, zIndex: 50,
                background: '#fff', borderRadius: 16, padding: 6,
                boxShadow: '0 12px 32px rgba(36,26,18,0.18)', border: '1px solid #f0e7dc',
              }}>
              <button role="menuitem"
                onClick={() => { setMenuOpen(false); onOpenSettings() }}
                style={menuItemStyle}
                onPointerEnter={e => e.currentTarget.style.background = '#f6efe6'}
                onPointerLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Settings size={17} color="#8a7d70" />
                <span>Settings</span>
              </button>
              <button role="menuitem"
                onClick={() => { setMenuOpen(false); signOut() }}
                style={menuItemStyle}
                onPointerEnter={e => e.currentTarget.style.background = '#f6efe6'}
                onPointerLeave={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={17} color="#8a7d70" />
                <span>Log out</span>
              </button>
            </div>
          )}
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
        <div style={{ display: 'flex', height: 8, borderRadius: 4, marginTop: 13, overflow: 'hidden', background: 'rgba(255,255,255,0.16)' }}>
          {catStats.map(cat => {
            if (!cat.tried) return null
            return (
              <div key={cat.id} style={{ flex: `0 0 ${cat.tried / totalFoods * 100}%`, height: '100%', background: cat.color, transition: 'flex-basis .35s ease' }} />
            )
          })}
        </div>
      </button>

      {/* Food groups heading */}
      <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 19, fontWeight: 800, color: '#241a12' }}>
        Food groups
      </div>

      {/* Category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {catStats.map(cat => (
          <button key={cat.id} onClick={() => onOpenCategory(cat.id)}
            style={{
              background: cat.color, borderRadius: 20, padding: '12px 13px', color: '#fff',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden', minHeight: 110,
              transition: 'transform .1s ease',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>
                {cat.emoji}
              </div>
              <span style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 14, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '2px 8px' }}>
                {cat.tried}/{cat.total}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17, marginTop: 8 }}>{cat.label}</div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.28)', marginTop: 5, overflow: 'hidden' }}>
                <div style={{ width: `${cat.total ? cat.tried / cat.total * 100 : 0}%`, height: '100%', background: '#fff', borderRadius: 3, transition: 'width .35s ease' }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
