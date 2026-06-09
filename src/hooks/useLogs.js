import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabaseClient'

export function useLogs() {
  const { dispatch } = useApp()

  async function fetchLogs(userId) {
    dispatch({ type: 'SET_LOADING', loading: { logs: true } })
    const { data, error } = await supabase
      .from('baby_food_logs')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    const logsMap = (data ?? []).reduce((acc, log) => {
      acc[log.food_id] = log
      return acc
    }, {})
    dispatch({ type: 'SET_LOGS', logs: logsMap })
  }

  async function upsertLog({ food_id, date_tried, reaction, notes, userId }) {
    const { data, error } = await supabase
      .from('baby_food_logs')
      .upsert(
        { food_id, user_id: userId, date_tried, reaction, notes },
        { onConflict: 'food_id,user_id' }
      )
      .select()
      .single()
    if (error) throw error
    dispatch({ type: 'UPSERT_LOG', log: data })
    return data
  }

  return { fetchLogs, upsertLog }
}
