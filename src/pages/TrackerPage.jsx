import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useFoods } from '../hooks/useFoods'
import { useLogs } from '../hooks/useLogs'
import { useProfile } from '../hooks/useProfile'
import HomeScreen from './HomeScreen'
import CategoryScreen from './CategoryScreen'
import SettingsScreen from './SettingsScreen'
import FoodModal from '../components/tracker/FoodModal'

export default function TrackerPage() {
  const { state } = useApp()
  const { fetchFoods } = useFoods()
  const { fetchLogs } = useLogs()
  const { fetchProfile } = useProfile()
  const [screen, setScreen] = useState('home')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    if (state.user) {
      fetchFoods(state.user.id)
      fetchLogs(state.user.id)
      fetchProfile(state.user.id)
    }
  }, [state.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function openCategory(cat) {
    setActiveCategory(cat)
    setScreen('category')
  }

  return (
    <div style={{ width: '100%', minHeight: '100dvh', background: '#fff6ee', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {screen === 'home' && (
        <HomeScreen onOpenCategory={openCategory} onOpenSettings={() => setScreen('settings')} />
      )}
      {screen === 'category' && (
        <CategoryScreen category={activeCategory} onBack={() => setScreen('home')} />
      )}
      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('home')} />
      )}
      <FoodModal />
    </div>
  )
}
