import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'
import { useFoods } from '../../hooks/useFoods'
import { useLogs } from '../../hooks/useLogs'
import { REACTION_MAP, CATEGORIES, CATEGORY_MAP, MOODS, BABY_NAME } from '../../lib/preloadedFoods'

const REACTION_FACE = {
  loved:     { mouth: 'M6 13 q6 7 12 0', eyeY: 9.5, hearts: true },
  meh:       { mouth: 'M7 14.5 q2.5 -2.5 5 0 q2.5 2.5 5 0', eyeY: 10 },
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
  const today = format(new Date(), 'yyyy-MM-dd')

  const stored = existing?.reaction ?? 'not_tried'
  const [tried, setTried] = useState(stored !== 'not_tried')
  const [mood, setMood] = useState(MOODS.includes(stored) ? stored : null)
  const [dateTried, setDateTried] = useState(existing?.date_tried ?? null)
  const [editingDate, setEditingDate] = useState(false)
  const [error, setError] = useState('')

  // Every interaction saves immediately — there is no Save button in this sheet
  async function save({ reaction, date_tried }) {
    setError('')
    try {
      await upsertLog({
        food_id: food.id,
        userId: state.user.id,
        reaction,
        date_tried,
        notes: existing?.notes ?? null,
      })
    } catch (err) {
      setError(err.message)
    }
  }

  function markTried() {
    if (tried) return
    const date = dateTried ?? today
    setTried(true)
    setDateTried(date)
    save({ reaction: mood ?? 'tried', date_tried: date })
  }

  function markNotYet() {
    if (!tried) return
    setTried(false)
    setEditingDate(false)
    save({ reaction: 'not_tried', date_tried: null })
  }

  function pickMood(m) {
    const next = mood === m ? null : m
    setMood(next)
    save({ reaction: next ?? 'tried', date_tried: dateTried })
  }

  function changeDate(value) {
    if (!value) return
    setDateTried(value)
    save({ reaction: mood ?? 'tried', date_tried: value })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      {/* Handle bar */}
      <div style={{ width: 44, height: 5, borderRadius: 3, background: '#e3d7c8', margin: '10px auto 14px', flexShrink: 0 }} />

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18, padding: '0 18px', flexShrink: 0 }}>
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

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 18px 22px' }} className="scrollbar-hide">
        {/* Not yet / Tried it toggle */}
        <div style={{ display: 'flex', background: '#f3ece2', borderRadius: 26, padding: 5, marginBottom: 18 }}>
          <button type="button" onClick={markNotYet}
            style={{
              flex: 1, padding: '13px 8px', borderRadius: 21, border: 'none', cursor: 'pointer',
              background: !tried ? '#fff' : 'transparent',
              boxShadow: !tried ? '0 4px 12px rgba(36,26,18,0.14)' : 'none',
              color: !tried ? '#241a12' : '#8a7d70',
              fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 16,
              transition: 'all .15s ease',
            }}>
            Not yet
          </button>
          <button type="button" onClick={markTried}
            style={{
              flex: 1, padding: '13px 8px', borderRadius: 21, border: 'none', cursor: 'pointer',
              background: tried ? '#f5862f' : 'transparent',
              boxShadow: tried ? '0 5px 14px rgba(245,134,47,0.45)' : 'none',
              color: tried ? '#fff' : '#8a7d70',
              fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 16,
              transition: 'all .15s ease',
            }}>
            {tried ? '✓ Tried it' : 'Tried it'}
          </button>
        </div>

        {tried ? (
          <>
            {/* Mood picker */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17, color: '#241a12' }}>
                How did {BABY_NAME} like it?
              </div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, color: '#8a7d70' }}>
                optional
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              {MOODS.map(m => {
                const r = REACTION_MAP[m]
                const on = m === mood
                return (
                  <button key={m} type="button" onClick={() => pickMood(m)}
                    style={{
                      textAlign: 'center', borderRadius: 20, padding: '20px 4px 16px',
                      border: 'none', cursor: 'pointer',
                      background: on ? r.color : '#f3ece2',
                      boxShadow: on ? `0 0 0 4px ${r.color}33, 0 6px 16px ${r.color}55` : 'none',
                      display: 'grid', placeItems: 'center',
                      transition: 'transform .1s ease, background .15s ease',
                    }}
                    onPointerDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                    onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <Face reaction={m} size={30} ink={on ? '#fff' : '#8a7d70'} />
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12.5, marginTop: 6, color: on ? '#fff' : '#8a7d70' }}>
                      {r.label}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* First tried date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f6efe6', borderRadius: 20, padding: '14px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: '#8a7d70' }}>
                  FIRST TRIED
                </div>
                {editingDate ? (
                  <input type="date" autoFocus value={dateTried ?? ''} max={today}
                    onChange={e => changeDate(e.target.value)}
                    style={{
                      marginTop: 4, padding: '6px 10px', borderRadius: 12, border: '2px solid #e8ddd4',
                      fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14, color: '#241a12',
                      background: '#fff', outline: 'none', boxSizing: 'border-box', maxWidth: '100%',
                    }} />
                ) : (
                  <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 22, color: '#241a12', marginTop: 2, lineHeight: 1.1 }}>
                    {dateTried ? format(parseISO(dateTried), 'MMM d') : '—'}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => setEditingDate(v => !v)}
                style={{
                  flexShrink: 0, border: 'none', cursor: 'pointer',
                  background: '#fdeedd', color: '#f5862f',
                  fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 15,
                  padding: '10px 16px', borderRadius: 14,
                }}>
                {editingDate ? 'Done' : 'Change'}
              </button>
            </div>
          </>
        ) : (
          /* Not-yet message */
          <div style={{
            background: '#f6efe6', borderRadius: 20, padding: '18px 20px', textAlign: 'center',
            fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, lineHeight: 1.5, color: '#8a7d70',
          }}>
            {food.name} is still on the list — mark it tried when {BABY_NAME} takes the first taste.
          </div>
        )}

        {error && <p style={{ color: '#ec4d3f', fontWeight: 700, fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}
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
