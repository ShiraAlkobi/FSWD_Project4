import React from 'react'

export default function ActionRow({ onDeleteChar, onDeleteWord, onClearAll, onUndo }) {
  return (
    <div>
      <div style={labelStyle}>Actions</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={onDeleteChar} style={btn('danger')}>⌫ Char</button>
        <button onClick={onDeleteWord} style={btn('danger')}>⌫ Word</button>
        <button onClick={onClearAll}   style={btn('danger')}>✕ Clear</button>
        <span style={{ display: 'inline-block', width: 1, height: 22, background: '#e0ddd6', alignSelf: 'center' }} />
        <button onClick={onUndo}       style={btn('action')}>↩ Undo</button>
      </div>
    </div>
  )
}

function btn(variant) {
  const base = { height: 32, padding: '0 12px', borderRadius: 8, borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 13 }
  if (variant === 'danger') return { ...base, background: '#FCEBEB', borderColor: '#F09595', color: '#A32D2D' }
  if (variant === 'action') return { ...base, background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }
  return base
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }