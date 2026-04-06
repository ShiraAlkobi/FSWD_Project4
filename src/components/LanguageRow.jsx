import React from 'react'
import { LANGUAGES } from '../data/keyboardData.js'

export default function LanguageRow({ language, onLanguageChange }) {
  return (
    <div>
      <div style={labelStyle}>Language</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {LANGUAGES.map(lang => (
          <button key={lang.id} onClick={() => onLanguageChange(lang.id)} style={btn(language === lang.id)}>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function btn(active) {
  return {
    height: 30, minWidth: 40, padding: '0 8px', borderRadius: 7,
    borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 13,
    background:  active ? '#E6F1FB' : '#fff',
    borderColor: active ? '#85B7EB' : '#e0ddd6',
    color:       active ? '#185FA5' : '#1a1a1a',
    fontWeight:  active ? 600       : 400,
  }
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }