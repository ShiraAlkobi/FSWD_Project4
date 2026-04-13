import React from 'react'
import { COLORS } from '../data/keyboardData.js'

export default function ColorRow({ color, onColorChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={label}>Color</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 0.2fr)', gap: 4, alignItems: 'center', justifyItems: 'center' }}>
        {COLORS.map(c => (
          <button
            key={c.id}
            title={c.id}
            onClick={() => onColorChange(c.id)}
            style={{
              width: 35, height: 35, borderRadius: 6, background: c.hex, cursor: 'pointer',
              borderWidth: color === c.id ? '2px' : '1px',
              borderStyle: 'solid',
              borderColor: color === c.id ? '#fff' : 'rgba(0,0,0,0.15)',
              boxShadow: color === c.id
                ? `0 0 0 1.5px #4db896, 0 1px 3px rgba(0,0,0,0.2)`
                : '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.15s',
              position: 'relative',
              padding: 0,
            }}
          >
            {color === c.id && (
              <span style={{ fontSize: 10, color: '#fff', textShadow: '0 0 2px rgba(0,0,0,0.5)', fontWeight: 700 }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

const label = { fontSize: 10, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }