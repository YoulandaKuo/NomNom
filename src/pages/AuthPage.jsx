import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password)
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      } else {
        await signIn(email, password)
        // AppContext auth listener handles redirect
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Mascot + title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-bounce">🦔</div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Nom Nom</h1>
          <p className="text-slate-500 mt-1 font-semibold">Your baby's food adventure tracker</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-lg font-extrabold text-slate-700 mb-5">
            {mode === 'signin' ? 'Welcome back! 👋' : 'Create an account 🎉'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />

            {error && (
              <p className="text-sm text-red-500 font-semibold bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 font-semibold bg-green-50 rounded-xl px-3 py-2">
                {success}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading
                ? 'Please wait…'
                : mode === 'signin' ? 'Sign in' : 'Create account'
              }
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess('') }}
              className="font-bold text-orange-500 hover:text-orange-600"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
