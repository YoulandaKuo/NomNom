import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabaseClient'

export function useProfile() {
  const { dispatch } = useApp()

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('language')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error

    if (data) {
      dispatch({ type: 'SET_LANGUAGE', language: data.language })
      return
    }

    const { data: created, error: upsertError } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, language: 'en' })
      .select('language')
      .single()
    if (upsertError) throw upsertError
    dispatch({ type: 'SET_LANGUAGE', language: created.language })
  }

  async function setLanguage({ userId, language }) {
    dispatch({ type: 'SET_LANGUAGE', language })
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, language })
    if (error) throw error
  }

  return { fetchProfile, setLanguage }
}
