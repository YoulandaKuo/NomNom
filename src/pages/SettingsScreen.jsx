import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SettingsScreen({ onBack }) {
  const { state, dispatch } = useApp()
  const [name, setName] = useState(state.babyName)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const trimmed = name.trim()
    dispatch({ type: 'SET_BABY_NAME', name: trimmed })
    setName(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  const dirty = name.trim() !== state.babyName

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 600, width: '100%', margin: '0 auto', padding: '16px 17px 32px', gap: 18 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
        <button onClick={onBack}
          style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(36,26,18,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70', flexShrink: 0 }}
          aria-label="Back">
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 26, fontWeight: 800, color: '#241a12' }}>
          Settings
        </div>
      </div>

      {/* Baby name field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="baby-name"
          style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: 0.4, color: '#8a7d70' }}>
          BABY'S NAME
        </label>
        <input id="baby-name" type="text" value={name} placeholder="e.g. Remi"
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && dirty) handleSave() }}
          style={{
            padding: '14px 16px', borderRadius: 16, border: '2px solid #e8ddd4',
            fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 18, color: '#241a12',
            background: '#fff', outline: 'none', boxSizing: 'border-box',
          }} />
        <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: 13, color: '#a89c8f', lineHeight: 1.4 }}>
          We'll use this name throughout the app. Leave it blank to just say "your baby".
        </div>
      </div>

      <button onClick={handleSave} disabled={!dirty}
        style={{
          marginTop: 4, padding: '14px 16px', borderRadius: 16, border: 'none',
          fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17,
          color: '#fff', background: dirty ? '#ff7d24' : '#e8ddd4',
          cursor: dirty ? 'pointer' : 'default', transition: 'background .15s ease',
        }}>
        {saved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  )
}
