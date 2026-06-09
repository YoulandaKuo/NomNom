import { useState } from 'react'
import { MILESTONES } from '../../lib/preloadedFoods'
import { X } from 'lucide-react'

export default function HojiMessage({ score }) {
  const [dismissed, setDismissed] = useState(
    () => Number(localStorage.getItem('hoji_dismissed') ?? 0)
  )

  const currentMilestone = [...MILESTONES].reverse().find(m => score >= m.count)
  const showBanner = currentMilestone && currentMilestone.count > dismissed

  function handleDismiss() {
    localStorage.setItem('hoji_dismissed', currentMilestone.count)
    setDismissed(currentMilestone.count)
  }

  if (!showBanner) return null

  return (
    <div className="mx-4 mb-2 flex items-center gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3">
      <span className="text-3xl select-none">🦔</span>
      <p className="flex-1 text-sm font-bold text-amber-800">{currentMilestone.message}</p>
      <button
        onClick={handleDismiss}
        className="text-amber-400 hover:text-amber-600 transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
