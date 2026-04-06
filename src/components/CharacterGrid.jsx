import React from 'react'
import { CHAR_LAYOUTS } from '../data/keyboardData.js'

export default function CharacterGrid({ language, shifted, onShiftToggle, onChar }) {
  const layoutKey = (language === 'en' && shifted) ? 'EN' : language
  const rows = CHAR_LAYOUTS[layoutKey] ?? CHAR_LAYOUTS['en']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, height: '100%' }}>
      <div style={labelStyle}>Characters</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, justifyContent: 'center' }}>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {row.map((char, charIndex) => (
              <button key={charIndex} onClick={() => onChar(char)} style={btn()}>
                {char}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row */}
        <div style={{ display: 'flex', gap: 4 }}>
          {language === 'en' && (
            <button onClick={onShiftToggle} style={btn(shifted ? 'purple' : 'orange')}>⇧</button>
          )}
          <button onClick={() => onChar(' ')}  style={{ ...btn(), flex: 1 }}>space</button>
          <button onClick={() => onChar('\n')} style={btn('orange')}>↵</button>
        </div>

      </div>
    </div>
  )
}

// Returns a button style object — no mixing of border shorthand and borderColor
function btn(variant) {
  const base = {
    height: 32, minWidth: 32, padding: '0 4px',
    borderRadius: 7, borderWidth: '1.5px', borderStyle: 'solid',
    cursor: 'pointer', fontSize: 13, background: '#fff',
    color: '#1a1a1a', borderColor: '#e0ddd6',
  }
  if (variant === 'orange') return { ...base, background: '#FAECE7', borderColor: '#F0997B', color: '#993C1D' }
  if (variant === 'purple') return { ...base, background: '#EEEDFE', borderColor: '#7F77DD', color: '#3C3489' }
  return base
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }