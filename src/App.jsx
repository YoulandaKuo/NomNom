import { useApp } from './context/AppContext'
import { useT } from './lib/i18n'
import AuthPage from './pages/AuthPage'
import TrackerPage from './pages/TrackerPage'

export default function App() {
  const { state } = useApp()
  const t = useT()

  if (state.loading.auth) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ece8e1' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/hedgehog.png" alt="" style={{ width: 75, height: 56, objectFit: 'contain' }} />
          <p style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 15, color: '#8a7d70', marginTop: 8 }}>{t('app.loading')}</p>
        </div>
      </div>
    )
  }

  return state.user ? <TrackerPage /> : <AuthPage />
}
