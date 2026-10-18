'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient()

type Mode = 'login' | 'register'

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setToken('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await authClient.signIn.email({ email, password })
    if (err || !data) {
      setError(err?.message ?? 'Sign in failed.')
      setLoading(false)
      return
    }
    const role = (data.user as { role?: string }).role
    if (role !== 'admin') {
      await authClient.signOut()
      setError('Access denied. This login is for admins only.')
      setLoading(false)
      return
    }
    router.push('/store-admin')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, token }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Registration failed.')
      setLoading(false)
      return
    }
    // Auto sign-in after registration
    const { data, error: err } = await authClient.signIn.email({ email, password })
    if (err || !data) {
      setError('Registered but sign-in failed. Try logging in.')
      setLoading(false)
      return
    }
    router.push('/store-admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="auth-modal" style={{ position: 'relative' }}>
        <p className="eyebrow">INTERNAL GARAGE</p>
        <h2 className="auth-title">{mode === 'login' ? 'Admin sign in' : 'Admin registration'}</h2>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required autoFocus />
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
                <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button className="red-button full" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required autoFocus />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
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
                <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            <label>
              Invite token
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button className="red-button full" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create admin account'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted-foreground)' }}>
          <a href="/" style={{ color: 'var(--muted-foreground)' }}>← Store</a>
          <button
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--muted-foreground)', padding: 0 }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
