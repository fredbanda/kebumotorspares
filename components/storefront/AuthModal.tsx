'use client'

import { useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient()

interface AuthModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error: err } = await authClient.signUp.email({ name, email, password })
        if (err) { setError(err.message ?? 'Sign up failed'); setLoading(false); return }
      } else {
        const { error: err } = await authClient.signIn.email({ email, password })
        if (err) { setError(err.message ?? 'Sign in failed'); setLoading(false); return }
      }
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/' })
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close"><X size={18} /></button>

        <p className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</p>
        <h2 className="auth-title">{mode === 'login' ? 'Sign in' : 'Sign up'}</h2>

        <button className="google-button" type="button" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="red-button full" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
