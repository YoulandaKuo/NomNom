import { useMemo } from 'react'
import { LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../hooks/useAuth'
import HojiMessage from '../mascot/HojiMessage'

export default function Header() {
  const { state } = useApp()
  const { signOut } = useAuth()

  const varietyScore = useMemo(
    () => Object.values(state.logs).filter(l => l.reaction !== 'not_tried').length,
    [state.logs]
  )

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Nom Nom</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Variety score */}
          <div className="flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 rounded-2xl px-3 py-1.5">
            <span className="text-base">🌟</span>
            <span className="text-sm font-extrabold text-orange-600">{varietyScore}</span>
            <span className="text-xs font-semibold text-orange-400 hidden sm:inline">tried</span>
          </div>

          <button
            onClick={signOut}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <HojiMessage score={varietyScore} />
    </header>
  )
}
