import React from 'react'
import { FONTS, SIZES } from '../data/keyboardData.js'

export default function StyleRow({
  font, size, bold, italic, underline,
  onFontChange, onSizeChange, onBoldToggle, onItalicToggle, onUnderlineToggle,
  styleScope, onStyleScopeChange,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

      {/* Scope toggle */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => onStyleScopeChange('from-now')} style={scopeBtn(styleScope === 'from-now')}>From now</button>
        <button onClick={() => onStyleScopeChange('all')}      style={scopeBtn(styleScope === 'all')}>All text</button>
      </div>

      {/* Font family */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <label style={label}>Font</label>
        <select value={font} onChange={e => onFontChange(e.target.value)} style={select}>
          {FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>

      {/* Size */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <label style={label}>Size</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {SIZES.map(s => (
            <button key={s.id} onClick={() => onSizeChange(s.id)} style={{ ...sizeBtn(size === s.id), fontSize: s.px * 0.65 }}>A</button>
          ))}
        </div>
      </div>

      {/* B / I / U */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <label style={label}>Format</label>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onBoldToggle}      style={{ ...formatBtn(bold),      fontWeight: 700             }}>B</button>
          <button onClick={onItalicToggle}    style={{ ...formatBtn(italic),    fontStyle: 'italic'         }}>I</button>
          <button onClick={onUnderlineToggle} style={{ ...formatBtn(underline), textDecoration: 'underline' }}>U</button>
        </div>
      </div>

    </div>
  )
}

const label = { fontSize: 10, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }

const select = {
  padding: '5px 8px', borderRadius: 7,
  borderWidth: '1px', borderStyle: 'solid', borderColor: '#b8d8c8',
  fontSize: 12, cursor: 'pointer', background: '#f4fbf7', color: '#1a3a2a',
  outline: 'none',
}

function scopeBtn(active) {
  return {
    flex: 1, height: 26, padding: '0 6px', borderRadius: 6,
    borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', fontSize: 11,
    background:  active ? '#e0f5ef' : '#f9fdfb',
    borderColor: active ? '#4db896' : '#c0d8c8',
    color:       active ? '#0a6647' : '#5a8a7a',
    fontWeight:  active ? 600       : 400,
  }
}

function sizeBtn(active) {
  return {
    flex: 1, height: 30, borderRadius: 7,
    borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer',
    background:  active ? '#e0f5ef' : '#f9fdfb',
    borderColor: active ? '#4db896' : '#c0d8c8',
    color:       active ? '#0a6647' : '#2a4a3a',
    fontWeight:  active ? 700       : 400,
  }
}

function formatBtn(active) {
  return {
    width: 34, height: 30, borderRadius: 7,
    borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', fontSize: 13,
    background:  active ? '#e0f5ef' : '#f9fdfb',
    borderColor: active ? '#4db896' : '#c0d8c8',
    color:       active ? '#0a6647' : '#2a4a3a',
  }
}