import React from 'react'
import { FONTS, SIZES, COLORS } from '../data/keyboardData.js'

export default function DocumentWindow({ doc, isActive, onSelect, onClose, size }) {
  const [cursorOn, setCursorOn] = React.useState(true)
  React.useEffect(() => {
    const t = setInterval(() => setCursorOn(p => !p), 500)
    return () => clearInterval(t)
  }, [])

  // Get cursor width based on text size
  function getCursorWidth() {
    const cursorWidths = {
      'sm': 1.5,
      'md': 1.7,
      'lg': 2.1,
      'xl': 2.4,
    }
    return cursorWidths[size] || 1.5
  }

  function segStyle(seg) {
    const f = FONTS.find(f => f.id === seg.font)
    const s = SIZES.find(s => s.id === seg.size)
    const c = COLORS.find(c => c.id === seg.color)
    return {
      fontFamily: f?.css ?? 'sans-serif', fontSize: s?.px ?? 12,
      fontWeight: seg.bold ? 700 : 400, fontStyle: seg.italic ? 'italic' : 'normal',
      textDecoration: seg.underline ? 'underline' : 'none', color: c?.hex ?? '#1a1a1a',
    }
  }

  const isEmpty = !doc.segments || doc.segments.length === 0

  return (
    <div onClick={onSelect} style={{
      background: '#fff',
      borderWidth: '1.5px', borderStyle: 'solid',
      borderColor: isActive ? '#4db896' : '#d0e8d8',
      borderRadius: 12, padding: '10px 12px', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120,
      position: 'relative',
      boxShadow: isActive ? '0 0 0 3px #c0f0e0' : '0 1px 4px rgba(0,80,40,0.06)',
      transition: 'all 0.15s',
    }}>
      {/* Close */}
      <button onClick={e => { e.stopPropagation(); onClose() }} style={{ position: 'absolute', top: 6, right: 6, background: '#fef0ee', borderWidth: '1px', borderStyle: 'solid', borderColor: '#f0a090', borderRadius: 6, width: 22, height: 22, cursor: 'pointer', color: '#a03020', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        ✕
      </button>
      {/* Title */}
      <div style={{ fontSize: 10, color: isActive ? '#0a6040' : '#8ab8a0', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, paddingRight: 28 }}>
        {doc.filename || 'Untitled'}
      </div>
      {/* Content */}
      <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 11, flex: 1, overflow: 'hidden' }}>
        {isEmpty
          ? <span style={{ color: '#b8d8c8', fontStyle: 'italic', fontSize: 15 }}>Empty…</span>
          : <>{doc.segments.map((seg, i) => <span key={i} style={segStyle(seg)}>{seg.text}</span>)}
              {isActive && <span style={{ display: 'inline-block', width: getCursorWidth(), height: '1.1em', background: cursorOn ? '#2a7a50' : 'transparent', marginLeft: 1, verticalAlign: 'middle' }} />}
            </>
        }
      </div>
    </div>
  )
}
