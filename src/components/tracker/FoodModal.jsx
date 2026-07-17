import { useState, useEffect, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'
import { useFoods } from '../../hooks/useFoods'
import { useLogs } from '../../hooks/useLogs'
import { REACTION_MAP, CATEGORIES, CATEGORY_MAP, MOODS } from '../../lib/preloadedFoods'
import { useT } from '../../lib/i18n'
import { translateFoodName } from '../../lib/foodNameTranslations'

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
function LogForm({ food, onClose, onEdit }) {
  const { state } = useApp()
  const { upsertLog } = useLogs()
  const { deleteCustomFood } = useFoods()
  const t = useT()
  const existing = state.logs[food.id]
  const cat = CATEGORY_MAP[food.category] ?? CATEGORIES[0]
  const today = format(new Date(), 'yyyy-MM-dd')
  const canDelete = !food.is_preloaded && food.user_id === state.user.id
  const babyName = state.babyName || t('foodModal.babyNameFallback')
  const foodName = translateFoodName(food.name, state.language)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm(t('foodModal.deleteConfirm', { name: foodName }))) return
    setDeleting(true)
    setError('')
    try {
      await deleteCustomFood({ foodId: food.id, userId: state.user.id })
      onClose()
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

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
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, margin: '18px 0', padding: '0 18px', flexShrink: 0 }}>
        <div style={{
          width: 62, height: 62, flexShrink: 0, borderRadius: 20,
          background: cat.tint, display: 'grid', placeItems: 'center', fontSize: 36,
        }}>
          {food.emoji ?? food.name?.[0] ?? '🍽️'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 24, lineHeight: 1, color: '#241a12' }}>
            {foodName}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 12,
              background: cat.tint, color: cat.dk, borderRadius: 20, padding: '3px 10px', lineHeight: 1.4,
            }}>
              {cat.emoji} {t('categoryLabel.' + cat.id)}
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
            {t('foodModal.notYet')}
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
            {tried ? t('foodModal.triedItChecked') : t('foodModal.triedIt')}
          </button>
        </div>

        {tried ? (
          <>
            {/* Mood picker */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17, color: '#241a12' }}>
                {t('foodModal.howDidLike', { babyName })}
              </div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, color: '#8a7d70' }}>
                {t('foodModal.optional')}
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
                      {t('reactionLabel.' + m)}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* First tried date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f6efe6', borderRadius: 20, padding: '14px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 11, letterSpacing: 0.8, color: '#8a7d70' }}>
                  {t('foodModal.firstTried')}
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
                {editingDate ? t('foodModal.done') : t('foodModal.change')}
              </button>
            </div>
          </>
        ) : (
          /* Not-yet message */
          <div style={{
            background: '#f6efe6', borderRadius: 20, padding: '18px 20px', textAlign: 'center',
            fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, lineHeight: 1.5, color: '#8a7d70',
          }}>
            {t('foodModal.stillOnList', { name: foodName, babyName })}
          </div>
        )}

        {error && <p style={{ color: '#ec4d3f', fontWeight: 700, fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}

        {canDelete && (
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" onClick={onEdit}
              style={{
                flex: 1, padding: '13px', borderRadius: 16,
                border: '2px solid #e8ddd4', background: '#f3ece2', color: '#241a12',
                fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 15,
                cursor: 'pointer',
              }}>
              {t('foodModal.editFood')}
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting}
              style={{
                flex: 1, padding: '13px', borderRadius: 16,
                border: '2px solid #f6dcd8', background: '#fdeae8', color: '#ec4d3f',
                fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 15,
                cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.6 : 1,
              }}>
              {deleting ? t('foodModal.deleting') : t('foodModal.deleteFood')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add custom food form ──────────────────────────────────────────────────────
function AddFoodForm({ onClose, onAdded }) {
  const { state } = useApp()
  const { addCustomFood } = useFoods()
  const t = useT()

  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [category, setCategory] = useState(state.addFoodDefaultCategory ?? 'Fruits')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  // Focus the name field once the modal has popped into place, without letting
  // the browser scroll the page to chase the input.
  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 300)
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const food = await addCustomFood({ name: name.trim(), category, emoji: emoji.trim(), userId: state.user.id })
      onAdded(food)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      <div style={{ padding: '20px 18px', flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 22, color: '#241a12' }}>{t('foodModal.addAFood')}</div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: '#f3ece2', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70' }}>
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>{t('foodModal.foodName')}</div>
            <input ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder={t('foodModal.foodNamePlaceholder')}
              required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
                background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
              }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70' }}>{t('foodModal.emoji')}</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 11, color: '#b0a498' }}>{t('foodModal.optional')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                placeholder={t('foodModal.emojiPlaceholder')}
                maxLength={2}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                  fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
                  background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: '#f3ece2',
                display: 'grid', placeItems: 'center', fontSize: 26, flexShrink: 0,
              }}>
                {emoji.trim() || name?.[0] || '🍽️'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 8 }}>{t('foodModal.category')}</div>
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
                  <span>{cat.emoji}</span><span>{t('categoryLabel.' + cat.id)}</span>
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
            {saving ? t('foodModal.adding') : t('foodModal.addFoodBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Edit custom food form ─────────────────────────────────────────────────────
function EditFoodForm({ food, onClose, onSaved }) {
  const { state } = useApp()
  const { updateCustomFood } = useFoods()
  const t = useT()

  const [name, setName] = useState(food.name)
  const [emoji, setEmoji] = useState(food.emoji ?? '')
  const [category, setCategory] = useState(food.category)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const updated = await updateCustomFood({
        foodId: food.id,
        name: name.trim(),
        category,
        emoji: emoji.trim(),
        userId: state.user.id,
      })
      onSaved(updated)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      <div style={{ padding: '20px 18px', flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 22, color: '#241a12' }}>{t('foodModal.editFood')}</div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: '#f3ece2', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#8a7d70' }}>
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>{t('foodModal.foodName')}</div>
            <input value={name} onChange={e => setName(e.target.value)} required
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
                background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
              }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70' }}>{t('foodModal.emoji')}</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 11, color: '#b0a498' }}>{t('foodModal.optional')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                placeholder={t('foodModal.emojiPlaceholder')}
                maxLength={2}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
                  fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
                  background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: '#f3ece2',
                display: 'grid', placeItems: 'center', fontSize: 26, flexShrink: 0,
              }}>
                {emoji.trim() || name?.[0] || '🍽️'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 8 }}>{t('foodModal.category')}</div>
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
                  <span>{cat.emoji}</span><span>{t('categoryLabel.' + cat.id)}</span>
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
            {saving ? t('foodModal.saving') : t('foodModal.saveChanges')}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Bottom sheet wrapper ──────────────────────────────────────────────────────
const ANIM_DURATION = 280

export default function FoodModal() {
  const { state, dispatch } = useApp()
  const [addedFood, setAddedFood] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const isOpen = !!state.modalFoodId || state.isAddingFood
  const food = state.modalFoodId
    ? state.foods.find(f => f.id === state.modalFoodId) ?? null
    : addedFood

  useEffect(() => {
    if (isOpen) {
      setExiting(false)
      setIsEditing(false)
      setVisible(true)
    } else if (visible) {
      setExiting(true)
      const t = setTimeout(() => {
        setVisible(false)
        setExiting(false)
        setAddedFood(null)
      }, ANIM_DURATION)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  function handleClose() {
    setExiting(true)
    setTimeout(() => {
      setAddedFood(null)
      setIsEditing(false)
      dispatch({ type: 'CLOSE_MODAL' })
    }, ANIM_DURATION)
  }

  function handleEditSaved(updatedFood) {
    setAddedFood(updatedFood)
    setIsEditing(false)
    dispatch({ type: 'OPEN_MODAL', foodId: updatedFood.id })
  }

  function handleAdded(newFood) {
    setAddedFood(newFood)
    dispatch({ type: 'CLOSE_MODAL' })
    dispatch({ type: 'OPEN_MODAL', foodId: newFood.id })
  }

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      {/* Backdrop — fades in over the static page */}
      <div onClick={handleClose}
        className={exiting ? 'modal-overlay-exit' : 'modal-overlay-enter'}
        style={{ position: 'absolute', inset: 0, background: 'rgba(36,26,18,0.5)' }}
      />
      {/* Modal — centered card that pops in over the overlay */}
      <div
        className={exiting ? 'modal-sheet-exit' : 'modal-sheet-enter'}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 460,
          background: '#fff', borderRadius: 28,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '88%', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {state.isAddingFood && !food
          ? <AddFoodForm onClose={handleClose} onAdded={handleAdded} />
          : food && isEditing
          ? <EditFoodForm food={food} onClose={handleClose} onSaved={handleEditSaved} />
          : food
          ? <LogForm food={food} onClose={handleClose} onEdit={() => setIsEditing(true)} />
          : null
        }
      </div>
    </div>
  )
}
