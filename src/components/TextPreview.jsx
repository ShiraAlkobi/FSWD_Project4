import React, { useState, useEffect } from 'react'
import { FONTS, SIZES, COLORS } from '../data/keyboardData.js'

// Renders each segment with its own style, then a blinking cursor at the end.

export default function TextPreview({ segments }) {
  const [cursorOn, setCursorOn] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setCursorOn(prev => !prev), 500)
    return () => clearInterval(interval)
  }, [])

  function segmentStyle(seg) {
    const activeFont  = FONTS.find(f => f.id === seg.font)
    const activeSize  = SIZES.find(s => s.id === seg.size)
    const activeColor = COLORS.find(c => c.id === seg.color)
    return {
      fontFamily:     activeFont?.css  ?? 'sans-serif',
      fontSize:       activeSize?.px   ?? 16,
      fontWeight:     seg.bold      ? 700       : 400,
      fontStyle:      seg.italic    ? 'italic'  : 'normal',
      textDecoration: seg.underline ? 'underline' : 'none',
      color:          activeColor?.hex ?? '#1a1a1a',
    }
  }

  const isEmpty = segments.length === 0

  return (
    <div style={{
      background: '#fff', border: '1.5px solid #e0ddd6',
      borderRadius: 10, padding: '8px 14px', minHeight: 52,
    }}>
      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
        Preview
      </div>

      <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {isEmpty
          ? <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 14 }}>Start typing…</span>
          : <>
              {/* Render each segment with its own style */}
              {segments.map((seg, i) => (
                <span key={i} style={segmentStyle(seg)}>{seg.text}</span>
              ))}
              {/* Blinking cursor after the last segment */}
              <span style={{
                display:       'inline-block',
                width:         2,
                height:        '1.1em',
                background:    cursorOn ? '#333' : 'transparent',
                marginLeft:    1,
                verticalAlign: 'text-bottom',
              }} />
            </>
        }
      </div>
    </div>
  )
}