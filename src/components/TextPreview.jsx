import React from 'react'

// Receives the text string and a pre-built style object from App.
// Purely display — no state, no handlers.

export default function TextPreview({ text, textStyle }) {
  return (
    <div style={{
      background:   '#fff',
      border:       '1.5px solid #e0ddd6',
      borderRadius: 12,
      padding:      '12px 16px',
      marginBottom: 12,
      minHeight:    70,
    }}>
      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Preview
      </div>

      <div style={{ ...textStyle, marginTop: 6, wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
        {/* Conditional rendering: placeholder if empty, real text if not */}
        {text
          ? text
          : <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 14 }}>Start typing…</span>
        }
      </div>
    </div>
  )
}