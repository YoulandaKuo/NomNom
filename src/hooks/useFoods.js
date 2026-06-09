import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabaseClient'

export function useFoods() {
  const { dispatch } = useApp()

  async function fetchFoods(userId) {
    dispatch({ type: 'SET_LOADING', loading: { foods: true } })
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .or(`is_preloaded.eq.true,user_id.eq.${userId}`)
      .order('name')
    if (error) throw error
    dispatch({ type: 'SET_FOODS', foods: data })
  }

  async function addCustomFood({ name, category, userId }) {
    const { data, error } = await supabase
      .from('foods')
      .insert({ name, category, is_preloaded: false, user_id: userId })
      .select()
      .single()
    if (error) throw error
    dispatch({ type: 'ADD_FOOD', food: data })
    return data
  }

  return { fetchFoods, addCustomFood }
}
