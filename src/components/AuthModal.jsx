import React, { useState } from 'react'
import { useAuth } from '../data/useAuth.js'

export default function AuthModal({ onSuccess, onClose }) {
  const { login, register } = useAuth()
  const [mode,     setMode]     = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  function handleSubmit() {
    setError('')
    const result = mode === 'login' ? login(username, password) : register(username, password)
    if (!result.ok) { setError(result.error); return }
    onSuccess(username.trim())
  }

  function handleKeyDown(e) { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,40,30,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', width: 340, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 12px 40px rgba(0,60,40,0.18)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4db896, #2a7abf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            👤
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0a3a2a' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </div>
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={fieldLabel}>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Enter username" style={input} />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={fieldLabel}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Enter password" style={input} />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: '#a03020', background: '#fef0ee', padding: '7px 12px', borderRadius: 8, borderWidth: '1px', borderStyle: 'solid', borderColor: '#f0b0a0' }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} style={submitBtn}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={{ fontSize: 12, color: '#7a9a8a', textAlign: 'center' }}>
          {mode === 'login'
            ? <>No account? <span onClick={() => { setMode('register'); setError('') }} style={link}>Register</span></>
            : <>Have an account? <span onClick={() => { setMode('login'); setError('') }} style={link}>Sign In</span></>
          }
        </div>

        <button onClick={onClose} style={cancelBtn}>Cancel</button>
      </div>
    </div>
  )
}

const fieldLabel = { fontSize: 11, color: '#4a7a6a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }
const input      = { height: 38, borderRadius: 9, borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#b8d8c8', padding: '0 12px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box', background: '#f4fbf7', color: '#0a3a2a' }
const submitBtn  = { height: 40, borderRadius: 10, borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#4db896', background: 'linear-gradient(135deg, #4db896, #2a9a70)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const cancelBtn  = { height: 32, borderRadius: 8, borderWidth: '1px', borderStyle: 'solid', borderColor: '#c8dcd4', background: '#f4f8f6', color: '#6a8a7a', fontSize: 12, cursor: 'pointer' }
const link       = { color: '#2a7abf', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }