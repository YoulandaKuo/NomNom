import { useApp } from './context/AppContext'
import AuthPage from './pages/AuthPage'
import TrackerPage from './pages/TrackerPage'

export default function App() {
  const { state } = useApp()

  if (state.loading.auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">🦔</div>
          <p className="font-bold text-slate-500">Loading…</p>
        </div>
      </div>
    )
  }

  return state.user ? <TrackerPage /> : <AuthPage />
}
