import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useFoods } from '../hooks/useFoods'
import { useLogs } from '../hooks/useLogs'
import Header from '../components/layout/Header'
import CategoryTabs from '../components/tracker/CategoryTabs'
import CategorySummary from '../components/tracker/CategorySummary'
import FoodGrid from '../components/tracker/FoodGrid'
import FoodModal from '../components/tracker/FoodModal'

export default function TrackerPage() {
  const { state } = useApp()
  const { fetchFoods } = useFoods()
  const { fetchLogs } = useLogs()

  useEffect(() => {
    if (state.user) {
      fetchFoods(state.user.id)
      fetchLogs(state.user.id)
    }
  }, [state.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <CategoryTabs />
        <CategorySummary />
        <FoodGrid />
      </main>
      <FoodModal />
    </div>
  )
}
