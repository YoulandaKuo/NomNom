import { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AppContext = createContext(null)

const initialState = {
  user: null,
  session: null,
  foods: [],
  logs: {},            // { [food_id]: { id, reaction, date_tried, notes } }
  babyName: localStorage.getItem('baby_name') || '',
  activeCategory: 'All',
  modalFoodId: null,
  isAddingFood: false,
  addFoodDefaultCategory: null,
  loading: { auth: true, foods: false, logs: false },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user, session: action.session, loading: { ...state.loading, auth: false } }
    case 'SET_FOODS':
      return { ...state, foods: action.foods, loading: { ...state.loading, foods: false } }
    case 'ADD_FOOD':
      return { ...state, foods: [...state.foods, action.food] }
    case 'DELETE_FOOD': {
      const { [action.foodId]: _removed, ...logs } = state.logs
      return { ...state, foods: state.foods.filter(f => f.id !== action.foodId), logs }
    }
    case 'SET_LOGS':
      return { ...state, logs: action.logs, loading: { ...state.loading, logs: false } }
    case 'UPSERT_LOG':
      return { ...state, logs: { ...state.logs, [action.log.food_id]: action.log } }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.category }
    case 'OPEN_MODAL':
      return { ...state, modalFoodId: action.foodId, isAddingFood: false }
    case 'OPEN_ADD_FOOD':
      return { ...state, modalFoodId: null, isAddingFood: true, addFoodDefaultCategory: action.category ?? null }
    case 'CLOSE_MODAL':
      return { ...state, modalFoodId: null, isAddingFood: false, addFoodDefaultCategory: null }
    case 'SET_BABY_NAME':
      localStorage.setItem('baby_name', action.name)
      return { ...state, babyName: action.name }
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, ...action.loading } }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_USER', user: session?.user ?? null, session })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_USER', user: session?.user ?? null, session })
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
