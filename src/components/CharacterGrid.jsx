import React from 'react'
import { CHAR_LAYOUTS } from '../data/keyboardData.js'

export default function CharacterGrid({ language, shifted, onShiftToggle, onChar }) {
  const layoutKey = (language === 'en' && shifted) ? 'EN' : language
  const rows = CHAR_LAYOUTS[layoutKey] ?? CHAR_LAYOUTS['en']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflow: 'auto' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            {row.map((char, charIndex) => (
              <button key={charIndex} onClick={() => onChar(char)} style={btn()}>
                {char}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row */}
        <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
          {language === 'en' && (
            <button onClick={onShiftToggle} style={btn(shifted ? 'purple' : 'orange')}>⇧</button>
          )}
          <button onClick={() => onChar(' ')}  style={{ ...btn(), flex: 1, minWidth: 50 }}>space</button>
          <button onClick={() => onChar('\n')} style={btn('orange')}>↵</button>
        </div>

      </div>
    </div>
  )
}

// Returns a button style object — no mixing of border shorthand and borderColor
function btn(variant) {
  const base = {
    height: 22, minWidth: 24, padding: '0 2px',
    borderRadius: 4, borderWidth: '1px', borderStyle: 'solid',
    cursor: 'pointer', fontSize: 9, background: '#fff',
    color: '#1a1a1a', borderColor: '#e0ddd6',
  }
  if (variant === 'orange') return { ...base, background: '#FAECE7', borderColor: '#F0997B', color: '#993C1D' }
  if (variant === 'purple') return { ...base, background: '#EEEDFE', borderColor: '#7F77DD', color: '#3C3489' }
  return base
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }