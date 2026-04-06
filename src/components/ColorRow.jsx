import React from 'react'
import { COLORS } from '../data/keyboardData.js'

// Props:
//   color         – active color id
//   onColorChange – called with new color id

export default function ColorRow({ color, onColorChange }) {
  return (
    <div>
      <div style={labelStyle}>Color</div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

        {/* List rendering: one circle per color */}
        {COLORS.map(c => (
          <button
            key={c.id}
            title={c.id}
            onClick={() => onColorChange(c.id)}
            style={{
              width:        26,
              height:       26,
              borderRadius: '50%',
              background:   c.hex,
              cursor:       'pointer',
              border:  color === c.id ? '3px solid #7F77DD'    : '2px solid transparent',
              outline:      color === c.id ? `2px solid ${c.hex}55` : 'none',
            }}
          />
        ))}

      </div>
    </div>
  )
}

const labelStyle = { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }