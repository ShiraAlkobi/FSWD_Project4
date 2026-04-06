import React from 'react'
import { CHAR_LAYOUTS } from '../data/KeyboardData.js'

// Props:
//   language      – current language id
//   shifted       – is shift active? (boolean)
//   onShiftToggle – called when Shift is pressed
//   onChar        – called with the character string when a key is pressed

export default function CharacterGrid({ language, shifted, onShiftToggle, onChar }) {
  // Pick the right layout from the data file
  const layoutKey = (language === 'en' && shifted) ? 'EN' : language
  const rows = CHAR_LAYOUTS[layoutKey] ?? CHAR_LAYOUTS['en']

  return (
    <div>
      <div style={labelStyle}>Characters</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

        {/* List rendering: one row at a time */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>

            {/* List rendering: one key at a time */}
            {row.map((char, charIndex) => (
              <button
                key={charIndex}
                onClick={() => onChar(char)}
                style={btnBase}
              >
                {char}
              </button>
            ))}

          </div>
        ))}

        {/* Bottom row: Shift / Space / Enter */}
        <div style={{ display: 'flex', gap: 5 }}>

          {/* Conditional rendering: Shift only shows for English */}
          {language === 'en' && (
            <button
              onClick={onShiftToggle}
              style={{
                ...btnBase,
                minWidth: 64,
                background:  shifted ? '#EEEDFE' : '#FAECE7',
                borderColor: shifted ? '#7F77DD' : '#F0997B',
                color:       shifted ? '#3C3489' : '#993C1D',
              }}
            >
              ⇧ Shift
            </button>
          )}

          <button onClick={() => onChar(' ')} style={{ ...btnBase, flex: 1 }}>
            space
          </button>

          <button onClick={() => onChar('\n')} style={{ ...btnBase, minWidth: 48, background: '#FAECE7', borderColor: '#F0997B', color: '#993C1D' }}>
            ↵
          </button>

        </div>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }
const btnBase    = { height: 34, minWidth: 34, padding: '0 6px', borderRadius: 8, border: '1.5px solid #e0ddd6', cursor: 'pointer', fontSize: 13, background: '#fff', color: '#1a1a1a' }