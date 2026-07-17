import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useT } from '../lib/i18n'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const t = useT()
  const [mode, setMode] = useState('signin')
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
        setSuccess(t('auth.accountCreated'))
        setMode('signin')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 14, border: '2px solid #e8ddd4',
    fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 15, color: '#241a12',
    background: '#faf5ee', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#ece8e1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Mascot + title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/hedgehog.png" alt="Nibble" height={72}
            style={{ width: 96, height: 72, objectFit: 'contain', display: 'inline-block' }} />
          <h1 style={{ fontFamily: '"Baloo 2", sans-serif', fontSize: 36, fontWeight: 800, color: '#241a12', margin: '8px 0 4px' }}>
            Nom Nom
          </h1>
          <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 14, color: '#8a7d70', margin: 0 }}>
            {t('auth.tagline')}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 28, padding: '24px 24px 28px', boxShadow: '0 8px 32px rgba(60,40,20,0.12)' }}>
          <h2 style={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 20, color: '#241a12', margin: '0 0 20px' }}>
            {mode === 'signin' ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>{t('auth.email')}</div>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" style={inputStyle} />
            </div>
            <div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 12, color: '#8a7d70', marginBottom: 6 }}>{t('auth.password')}</div>
              <input type="password" placeholder={mode === 'signup' ? t('auth.passwordMinPlaceholder') : '••••••••'}
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: '#fdeae8', borderRadius: 12, padding: '10px 14px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, color: '#ec4d3f' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#e8f7ee', borderRadius: 12, padding: '10px 14px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 13, color: '#16a34a' }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                padding: '14px', borderRadius: 18, border: 'none', cursor: 'pointer',
                background: '#ff7d24', color: '#fff',
                fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 17,
                marginTop: 4, opacity: loading ? 0.7 : 1,
              }}>
              {loading ? t('auth.pleaseWait') : mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: '#8a7d70', marginTop: 16, marginBottom: 0 }}>
            {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}
            <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Baloo 2", sans-serif', fontWeight: 800, fontSize: 13, color: '#ff7d24' }}>
              {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
