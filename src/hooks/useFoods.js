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

  async function deleteCustomFood({ foodId, userId }) {
    // Remove any log for this food first (baby_food_logs.food_id references foods.id)
    const { error: logErr } = await supabase
      .from('baby_food_logs')
      .delete()
      .eq('food_id', foodId)
      .eq('user_id', userId)
    if (logErr) throw logErr

    // Only the owner's custom (non-preloaded) foods can be deleted
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', foodId)
      .eq('user_id', userId)
      .eq('is_preloaded', false)
    if (error) throw error
    dispatch({ type: 'DELETE_FOOD', foodId })
  }

  return { fetchFoods, addCustomFood, deleteCustomFood }
}
