import React from 'react'

// Props (all are simple callback functions):
//   onDeleteChar – remove the last character
//   onDeleteWord – remove the last word
//   onClearAll   – wipe all text
//   onUndo       – restore previous text

export default function ActionRow({ onDeleteChar, onDeleteWord, onClearAll, onUndo }) {
  return (
    <div>
      <div style={labelStyle}>Actions</div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>

        {/* Destructive actions — red style */}
        <button onClick={onDeleteChar} style={{ ...btnBase, ...dangerStyle }}>⌫ Char</button>
        <button onClick={onDeleteWord} style={{ ...btnBase, ...dangerStyle }}>⌫ Word</button>
        <button onClick={onClearAll}   style={{ ...btnBase, ...dangerStyle }}>✕ Clear</button>

        <span style={{ display: 'inline-block', width: 1, height: 22, background: '#e0ddd6', margin: '0 2px', alignSelf: 'center' }} />

        {/* Undo — green style */}
        <button onClick={onUndo} style={{ ...btnBase, ...actionStyle }}>↩ Undo</button>

      </div>
    </div>
  )
}

const labelStyle  = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }
const btnBase     = { height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13 }
const dangerStyle = { background: '#FCEBEB', borderColor: '#F09595', color: '#A32D2D' }
const actionStyle = { background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }