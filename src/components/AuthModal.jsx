// ============================================================
//  AuthModal.jsx
//  Login / Register overlay.
//  Shown when the user clicks "Sign In" or when saving without auth.
//
//  Props:
//    onSuccess – called with username after successful login/register
//    onClose   – called when user dismisses the modal
// ============================================================

import React, { useState } from 'react'
import { useAuth } from '../data/useAuth.js'

export default function AuthModal({ onSuccess, onClose }) {
  const { login, register } = useAuth()

  const [mode,     setMode]     = useState('login')  // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  function handleSubmit() {
    setError('')
    const result = mode === 'login'
      ? login(username, password)
      : register(username, password)

    if (!result.ok) {
      setError(result.error)
      return
    }
    onSuccess(username.trim())
  }

  // Allow submitting with Enter key
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    // Dark overlay behind the modal
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>

      {/* Modal box */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: '28px 32px',
        width: 320, display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>

        {/* Title */}
        <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
          {mode === 'login' ? '👤 Sign In' : '✏️ Register'}
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter username"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
            style={inputStyle}
          />
        </div>

        {/* Error message */}
        {error && (
          <div style={{ fontSize: 12, color: '#A32D2D', background: '#FCEBEB', padding: '6px 10px', borderRadius: 7 }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button onClick={handleSubmit} style={submitBtn}>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Switch mode */}
        <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
          {mode === 'login'
            ? <>No account? <span onClick={() => { setMode('register'); setError('') }} style={linkStyle}>Register</span></>
            : <>Have an account? <span onClick={() => { setMode('login'); setError('') }} style={linkStyle}>Sign In</span></>
          }
        </div>

        {/* Close */}
        <button onClick={onClose} style={closeBtn}>Cancel</button>

      </div>
    </div>
  )
}

const labelStyle  = { fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle  = { height: 36, borderRadius: 8, border: '1.5px solid #e0ddd6', padding: '0 10px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }
const submitBtn   = { height: 38, borderRadius: 9, border: '1.5px solid #85B7EB', background: '#E6F1FB', color: '#185FA5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const closeBtn    = { height: 32, borderRadius: 8, border: '1px solid #e0ddd6', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }
const linkStyle   = { color: '#185FA5', cursor: 'pointer', textDecoration: 'underline' }