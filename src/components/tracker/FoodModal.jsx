import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useApp } from '../../context/AppContext'
import { useFoods } from '../../hooks/useFoods'
import { useLogs } from '../../hooks/useLogs'
import { REACTIONS, REACTION_MAP, CATEGORIES, CATEGORY_MAP } from '../../lib/preloadedFoods'

const REACTION_FACE = {
  loved:     { mouth: 'M6 13 q6 7 12 0', eyeY: 9.5, hearts: true },
  neutral:   { mouth: 'M7.5 14 h9',      eyeY: 10 },
  allergic:  { mouth: 'M7 15 q5 -4 10 0', eyeY: 10 },
  not_tried: { mouth: 'M7.5 14 h9',      eyeY: 10 },
}

function Face({ reaction, size = 28, ink = '#8a7d70' }) {
  const face = REACTION_FACE[reaction] ?? REACTION_FACE.not_tried
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      {face.hearts
        ? <>
            <path d="M8 8.5 q2 -2 3 0" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M13 8.5 q2 -2 3 0" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
          </>
        : <>
            <circle cx="9" cy={face.eyeY} r="1.4" fill={ink}/>
            <circle cx="15" cy={face.eyeY} r="1.4" fill={ink}/>
          </>
      }
      <path d={face.mouth} fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function XIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  )
}

// ── Log form (existing food) ──────────────────────────────────────────────────
function LogForm({ food, onClose }) {
  const { state } = useApp()
  const { upsertLog } = useLogs()
  const existing = state.logs[food.id]
  const cat = CATEGORY_MAP[food.category] ?? CATEGORIES[0]

  const [reaction, setReaction] = useState(existing?.reaction ?? 'not_tried')
  const [dateTried, setDateTried] = useState(existing?.date_tried ?? format(new Date(), 'yyyy-MM-dd'))
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleReact(r) {
    setReaction(r)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await upsertLog({
        food_id: food.id,
        date_tried: reaction !== 'not_tried' ? dateTried : null,
        reaction,
        notes: notes.trim() || null,
        userId: state.user.id,
      })
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const isNew = !existing || existing.reaction === 'not_tried'
  const statBlocks = [
    { label: 'Category', value: `${cat.emoji} ${cat.label}`, bg: cat.tint, color: cat.dk },
    { label: 'Date', value: existing?.date_tried ?? '—', bg: '#eef4ff', color: '#3b82f6' },
    { label: 'Mood', value: existing ? (REACTION_MAP[existing.reaction]?.label ?? existing.reaction) : 'New', bg: '#fff6e0', color: existing ? (REACTION_MAP[existing.reaction]?.color ?? '#c4b4a3') : '#c4b4a3' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      {/* Handle bar */}
      <div style={{ width: 44, height: 5, borderRadius: 3, background: '#e3d7c8', margin: '10px auto 12px', flexShrink: 0 }} />

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 13, padding: '0 18px', flexShrink: 0 }}>
        <div style={{
          width: 62, height: 62, flexShrink: 0, borderRadius: 20,
          background: cat.tint, display: 'grid', placeItems: 'center', fontSize: 36,
        }}>
          {food.emoji ?? cat.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 24, lineHeight: 1, color: '#241a12' }}>
            {food.name}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 12,
              background: cat.tint, color: cat.dk, borderRadius: 20, padding: '3px 10px', lineHeight: 1.4,
            }}>
              {cat.emoji} {cat.label}
            </span>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close"
          style={{ width: 34, height: 34, borderRadius: '50%', background: '#f3ece2', color: '#8a7d70', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <XIcon size={18} />
        </button>
      </div>

      {/* Stat blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 15, padding: '0 18px', flexShrink: 0 }}>
        {statBlocks.map(({ label, value, bg, color }) => (
          <div key={label} style={{ background: bg, borderRadius: 16, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 10, color: '#8a7d70', letterSpacing: 0.3 }}>
              {label.toUpperCase()}
            </div>
            <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 14, color, lineHeight: 1.2, marginTop: 2 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 18px 20px' }} className="scrollbar-hide">
        {/* Reaction picker */}
        <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 9, color: '#241a12' }}>
          {isNew ? 'Log the first taste' : 'How did it go this time?'}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 17 }}>
          {REACTIONS.filter(r => r.value !== 'not_tried').map(r => {
            const on = r.value === reaction
            return (
              <button key={r.value} type="button" onClick={() => handleReact(r.value)}
                style={{
                  flex: 1, textAlign: 'center', borderRadius: 16, padding: '9px 2px 7px',
                  border: 'none', cursor: 'pointer',
                  background: on ? r.color : '#f6efe6',
                  boxShadow: on ? `0 5px 14px ${r.color}55` : 'none',
                  transition: 'transform .1s ease, background .15s ease',
                }}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Face reaction={r.value} size={28} ink={on ? '#fff' : '#8a7d70'} />
                <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 10.5, marginTop: 3, color: on ? '#fff' : '#8a7d70' }}>
                  {r.label}
                </div>
              </button>
            )
          })}
        </div>

        {/* Date */}
        {reaction !== 'not_tried' && (
          <div style={{ marginBottom: 13 }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>DATE TRIED</div>
            <input type="date" value={dateTried} onChange={e => setDateTried(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14, color: '#241a12',
                background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
              }} />
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: 17 }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>NOTES (OPTIONAL)</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any observations, amounts, how it was prepared…"
            rows={3}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
              fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: 13, color: '#241a12',
              background: '#faf5ee', outline: 'none', resize: 'none', boxSizing: 'border-box',
            }} />
        </div>

        {error && <p style={{ color: '#ec4d3f', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button onClick={handleSave} disabled={saving || reaction === 'not_tried'}
          style={{
            width: '100%', padding: '14px', borderRadius: 18, border: 'none', cursor: 'pointer',
            background: reaction === 'not_tried' ? '#e8ddd4' : '#241a12',
            color: reaction === 'not_tried' ? '#8a7d70' : '#fff',
            fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17,
            transition: 'background .15s ease',
          }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── Add custom food form ──────────────────────────────────────────────────────
function AddFoodForm({ onClose, onAdded }) {
  const { state } = useApp()
  const { addCustomFood } = useFoods()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Fruits')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const food = await addCustomFood({ name: name.trim(), category, userId: state.user.id })
      onAdded(food)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      <div style={{ width: 44, height: 5, borderRadius: 3, background: '#e3d7c8', margin: '10px auto 0', flexShrink: 0 }} />
      <div style={{ padding: '16px 18px 20px', flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 22, color: '#241a12' }}>Add a food</div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: '#f3ece2', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70' }}>
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>FOOD NAME</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dragon Fruit"
              autoFocus required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
                background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
              }} />
          </div>

          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 8 }}>CATEGORY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '8px 6px', borderRadius: 14, fontSize: 12,
                    fontFamily: '"Baloo 2", sans-serif', fontWeight: 700,
                    border: '2px solid',
                    borderColor: category === cat.id ? cat.color : '#e8ddd4',
                    background: category === cat.id ? cat.color : '#faf5ee',
                    color: category === cat.id ? '#fff' : '#8a7d70',
                    cursor: 'pointer', transition: 'all .12s ease',
                  }}>
                  <span>{cat.emoji}</span><span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#ec4d3f', fontWeight: 700, fontSize: 13 }}>{error}</p>}

          <button type="submit" disabled={saving || !name.trim()}
            style={{
              padding: '14px', borderRadius: 18, border: 'none', cursor: 'pointer',
              background: !name.trim() ? '#e8ddd4' : '#241a12',
              color: !name.trim() ? '#8a7d70' : '#fff',
              fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17,
            }}>
            {saving ? 'Adding…' : 'Add food'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Bottom sheet wrapper ──────────────────────────────────────────────────────
export default function FoodModal() {
  const { state, dispatch } = useApp()
  const [addedFood, setAddedFood] = useState(null)
  const [shown, setShown] = useState(false)

  const isOpen = !!state.modalFoodId || state.isAddingFood
  const food = state.modalFoodId
    ? state.foods.find(f => f.id === state.modalFoodId) ?? null
    : addedFood

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setShown(true))
    else setShown(false)
  }, [isOpen])

  function handleClose() {
    setShown(false)
    setTimeout(() => {
      setAddedFood(null)
      dispatch({ type: 'CLOSE_MODAL' })
    }, 220)
  }

  function handleAdded(newFood) {
    setAddedFood(newFood)
    dispatch({ type: 'CLOSE_MODAL' })
    dispatch({ type: 'OPEN_MODAL', foodId: newFood.id })
  }

  useEffect(() => {
    if (!isOpen) setAddedFood(null)
  }, [isOpen])

  if (!isOpen && !shown) return null

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 6 }}>
      {/* Backdrop */}
      <div onClick={handleClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(36,26,18,0.5)',
          opacity: shown ? 1 : 0,
          transition: 'opacity .2s ease',
        }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderRadius: '28px 28px 0 0',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
        maxHeight: '88%', display: 'flex', flexDirection: 'column',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .22s cubic-bezier(.2,.8,.2,1)',
      }}>
        {state.isAddingFood && !food
          ? <AddFoodForm onClose={handleClose} onAdded={handleAdded} />
          : food
          ? <LogForm food={food} onClose={handleClose} />
          : null
        }
      </div>
    </div>
  )
}
