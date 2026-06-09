import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { useApp } from '../../context/AppContext'
import { useFoods } from '../../hooks/useFoods'
import { useLogs } from '../../hooks/useLogs'
import { REACTIONS, CATEGORIES, CATEGORY_MAP } from '../../lib/preloadedFoods'

// ── Log form (existing food) ──────────────────────────────────────────────────
function LogForm({ food, onClose }) {
  const { state } = useApp()
  const { upsertLog } = useLogs()
  const existing = state.logs[food.id]
  const cat = CATEGORY_MAP[food.category]

  const [reaction, setReaction] = useState(existing?.reaction ?? 'not_tried')
  const [dateTried, setDateTried] = useState(
    existing?.date_tried ?? format(new Date(), 'yyyy-MM-dd')
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
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
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>
            {cat.emoji} {food.category}
          </p>
          <h2 className="text-xl font-extrabold text-slate-800 mt-0.5">{food.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
          <X size={18} />
        </button>
      </div>

      {/* Reaction picker */}
      <div>
        <p className="text-sm font-bold text-slate-600 mb-2">How did it go?</p>
        <div className="grid grid-cols-2 gap-2">
          {REACTIONS.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setReaction(r.value)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95"
              style={
                reaction === r.value
                  ? { backgroundColor: r.color, borderColor: r.color, color: r.value === 'not_tried' ? '#94a3b8' : '#fff' }
                  : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }
              }
            >
              <span className="text-lg">{r.emoji}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      {reaction !== 'not_tried' && (
        <Input
          label="Date first tried"
          type="date"
          value={dateTried}
          onChange={e => setDateTried(e.target.value)}
          max={format(new Date(), 'yyyy-MM-dd')}
        />
      )}

      {/* Notes */}
      <Textarea
        label="Notes (optional)"
        placeholder="Any observations, amounts, preparation style…"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}

// ── Add custom food form ──────────────────────────────────────────────────────
function AddFoodForm({ onClose, onAdded }) {
  const { state } = useApp()
  const { addCustomFood } = useFoods()

  const [name, setName] = useState('')
  const [category, setCategory] = useState(
    state.activeCategory !== 'All' ? state.activeCategory : 'Fruits'
  )
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
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">Add a food</h2>
        <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
          <X size={18} />
        </button>
      </div>

      <Input
        label="Food name"
        placeholder="e.g. Dragon Fruit"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-600">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border-2 transition-all active:scale-95"
              style={
                category === cat.id
                  ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                  : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }
              }
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

      <Button type="submit" disabled={saving || !name.trim()} className="w-full">
        {saving ? 'Adding…' : 'Add food'}
      </Button>
    </form>
  )
}

// ── Main modal orchestrator ───────────────────────────────────────────────────
export default function FoodModal() {
  const { state, dispatch } = useApp()
  const [addedFood, setAddedFood] = useState(null)

  const isOpen = !!state.modalFoodId || state.isAddingFood
  const food = state.modalFoodId
    ? state.foods.find(f => f.id === state.modalFoodId) ?? null
    : addedFood

  function handleClose() {
    setAddedFood(null)
    dispatch({ type: 'CLOSE_MODAL' })
  }

  function handleAdded(newFood) {
    setAddedFood(newFood)
    dispatch({ type: 'CLOSE_MODAL' })
    // Immediately open the log form for the new food
    dispatch({ type: 'OPEN_MODAL', foodId: newFood.id })
  }

  // Clear addedFood when modal closes
  useEffect(() => {
    if (!isOpen) setAddedFood(null)
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {state.isAddingFood && !food
        ? <AddFoodForm onClose={handleClose} onAdded={handleAdded} />
        : food
        ? <LogForm food={food} onClose={handleClose} />
        : null
      }
    </Modal>
  )
}
