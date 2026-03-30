import React from 'react'
import { FONTS, SIZES } from '../data/KeyboardData.js'

// Props:
//   font, size, bold, italic, underline   – current values
//   onFontChange, onSizeChange            – called with new id
//   onBoldToggle, onItalicToggle, onUnderlineToggle – called on click

export default function StyleRow({ font, size, bold, italic, underline, onFontChange, onSizeChange, onBoldToggle, onItalicToggle, onUnderlineToggle }) {
  return (
    <div>
      <div style={labelStyle}>Style — from cursor</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Font family — list rendering */}
        {FONTS.map(f => (
          <button
            key={f.id}
            onClick={() => onFontChange(f.id)}
            style={{ ...btnBase, fontFamily: f.css, ...activeIf(font === f.id) }}
          >
            {f.label}
          </button>
        ))}

        <span style={divider} />

        {/* Font size — list rendering, each "A" is a different size */}
        {SIZES.map(s => (
          <button
            key={s.id}
            onClick={() => onSizeChange(s.id)}
            style={{ ...btnBase, fontSize: s.px * 0.7, ...activeIf(size === s.id) }}
          >
            A
          </button>
        ))}

        <span style={divider} />

        {/* Bold / Italic / Underline toggles */}
        <button onClick={onBoldToggle}      style={{ ...btnBase, fontWeight: 700,                      ...activeIf(bold)      }}>B</button>
        <button onClick={onItalicToggle}    style={{ ...btnBase, fontStyle: 'italic',                  ...activeIf(italic)    }}>I</button>
        <button onClick={onUnderlineToggle} style={{ ...btnBase, textDecoration: 'underline',          ...activeIf(underline) }}>U</button>

      </div>
    </div>
  )
}

// Returns active styles when condition is true — keeps JSX clean
function activeIf(condition) {
  return condition
    ? { background: '#EEEDFE', borderColor: '#7F77DD', color: '#3C3489', fontWeight: 600 }
    : {}
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }
const btnBase    = { height: 34, minWidth: 34, padding: '0 8px', borderRadius: 8, border: '1.5px solid #e0ddd6', cursor: 'pointer', fontSize: 13, background: '#fff', color: '#1a1a1a' }
const divider    = { display: 'inline-block', width: 1, height: 22, background: '#e0ddd6', margin: '0 2px' }