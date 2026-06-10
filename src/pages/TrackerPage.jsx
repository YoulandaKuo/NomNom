import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useFoods } from '../hooks/useFoods'
import { useLogs } from '../hooks/useLogs'
import HomeScreen from './HomeScreen'
import CategoryScreen from './CategoryScreen'
import FoodModal from '../components/tracker/FoodModal'

// Phone frame dimensions
const DEV_W = 374
const DEV_H = 792

function PhoneStage({ children }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const fit = () => {
      const m = 24
      const s = Math.min(1, (window.innerWidth - m) / DEV_W, (window.innerHeight - m) / DEV_H)
      setScale(s)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div style={{ width: DEV_W * scale, height: DEV_H * scale }}>
      <div style={{
        width: DEV_W, height: DEV_H,
        transform: `scale(${scale})`, transformOrigin: 'top left',
        borderRadius: 46, background: '#1c140d', padding: 7,
        boxShadow: '0 30px 70px rgba(60,40,20,0.32), 0 6px 18px rgba(60,40,20,0.2)',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 39,
          overflow: 'hidden', position: 'relative', background: '#fff6ee',
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function TrackerPage() {
  const { state } = useApp()
  const { fetchFoods } = useFoods()
  const { fetchLogs } = useLogs()
  const [screen, setScreen] = useState('home')      // 'home' | 'category'
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    if (state.user) {
      fetchFoods(state.user.id)
      fetchLogs(state.user.id)
    }
  }, [state.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function openCategory(cat) {
    setActiveCategory(cat)
    setScreen('category')
  }

  function goHome() {
    setScreen('home')
  }

  return (
    <PhoneStage>
      {screen === 'home'
        ? <HomeScreen onOpenCategory={openCategory} />
        : <CategoryScreen category={activeCategory} onBack={goHome} />
      }
      <FoodModal />
    </PhoneStage>
  )
}
