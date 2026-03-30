import React from 'react'
import { LANGUAGES } from '../data/KeyboardData.js'

// Props:
//   language         – the currently active language id (string)
//   onLanguageChange – called with the new language id when user clicks

export default function LanguageRow({ language, onLanguageChange }) {
  return (
    <div>
      <div style={labelStyle}>Language</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {/* List rendering: one button per language */}
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            style={{
              ...btnBase,
              background:  language === lang.id ? '#E6F1FB' : '#fff',
              borderColor: language === lang.id ? '#85B7EB' : '#e0ddd6',
              color:       language === lang.id ? '#185FA5' : '#1a1a1a',
              fontWeight:  language === lang.id ? 600 : 400,
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }
const btnBase    = { height: 34, minWidth: 44, padding: '0 10px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13 }