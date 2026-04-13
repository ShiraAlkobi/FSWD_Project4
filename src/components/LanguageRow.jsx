import React, { useState } from 'react'
import { LANGUAGES } from '../data/keyboardData.js'

export default function LanguageRow({ language, onLanguageChange }) {
  const [showPopup, setShowPopup] = useState(false)

  function handleLanguageSelect(langId) {
    onLanguageChange(langId)
    setShowPopup(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Globe button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        style={{
          height: 50,
          minWidth: 32,
          padding: '0 8px',
          borderRadius: 7,
          borderWidth: '1.5px',
          borderStyle: 'solid',
          cursor: 'pointer',
          fontSize: 22,
          background: showPopup ? '#606f7d' : '#c3d2e0',
          borderColor: showPopup ? '#85B7EB' : '#e0ddd6',
          color: '#1a1a1a',
          fontWeight: 600,
        }}
        title="Language"
      >
        🌐
      </button>

      {/* Language popup */}
      {showPopup && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 6,
          background: '#fff',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          borderColor: '#e0ddd6',
          borderRadius: 8,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          zIndex: 1000,
          minWidth: 120,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => handleLanguageSelect(lang.id)}
              style={{
                ...btn(language === lang.id),
                textAlign: 'left'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function btn(active) {
  return {
    height: 28,
    padding: '0 10px',
    borderRadius: 6,
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: 'pointer',
    fontSize: 12,
    background: active ? '#E6F1FB' : '#f8f8f8',
    borderColor: active ? '#85B7EB' : '#e0ddd6',
    color: active ? '#185FA5' : '#1a1a1a',
    fontWeight: active ? 600 : 400,
  }
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }