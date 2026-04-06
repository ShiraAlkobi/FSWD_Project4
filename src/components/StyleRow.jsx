import React from 'react'
import { FONTS, SIZES } from '../data/keyboardData.js'

export default function StyleRow({
  font, size, bold, italic, underline,
  onFontChange, onSizeChange, onBoldToggle, onItalicToggle, onUnderlineToggle,
  styleScope, onStyleScopeChange,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

      <div style={labelStyle}>Style</div>

      {/* Scope toggle */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => onStyleScopeChange('from-now')} style={scopeBtn(styleScope === 'from-now')}>From now</button>
        <button onClick={() => onStyleScopeChange('all')}      style={scopeBtn(styleScope === 'all')}>All text</button>
      </div>

      {/* Font family */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {FONTS.map(f => (
          <button key={f.id} onClick={() => onFontChange(f.id)} style={{ ...btn(font === f.id), fontFamily: f.css }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Size + B/I/U */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {SIZES.map(s => (
          <button key={s.id} onClick={() => onSizeChange(s.id)} style={{ ...btn(size === s.id), fontSize: s.px * 0.7 }}>A</button>
        ))}
        <span style={{ display: 'inline-block', width: 1, height: 20, background: '#e0ddd6', margin: '0 2px' }} />
        <button onClick={onBoldToggle}      style={{ ...btn(bold),      fontWeight: 700             }}>B</button>
        <button onClick={onItalicToggle}    style={{ ...btn(italic),    fontStyle: 'italic'         }}>I</button>
        <button onClick={onUnderlineToggle} style={{ ...btn(underline), textDecoration: 'underline' }}>U</button>
      </div>

    </div>
  )
}

// No border shorthand — always use borderWidth + borderStyle + borderColor
function btn(active) {
  return {
    height: 30, minWidth: 30, padding: '0 6px', borderRadius: 7,
    borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 12,
    background:  active ? '#EEEDFE' : '#fff',
    borderColor: active ? '#7F77DD' : '#e0ddd6',
    color:       active ? '#3C3489' : '#1a1a1a',
    fontWeight:  active ? 600       : 400,
  }
}

function scopeBtn(active) {
  return {
    height: 26, padding: '0 8px', borderRadius: 6,
    borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 11,
    background:  active ? '#EEEDFE' : '#fff',
    borderColor: active ? '#7F77DD' : '#e0ddd6',
    color:       active ? '#3C3489' : '#555',
    fontWeight:  active ? 600       : 400,
  }
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }