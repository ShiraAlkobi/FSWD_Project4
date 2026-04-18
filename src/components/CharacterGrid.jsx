import React from 'react'
import { CHAR_LAYOUTS } from '../data/keyboardData.js'
import LanguageRow from './LanguageRow.jsx'


export default function CharacterGrid({ language, shifted, onShiftToggle, 
            onChar, onDeleteChar, onLanguageChange }) {
  const layoutKey = (language === 'en' && shifted) ? 'EN' : language
  const rows = CHAR_LAYOUTS[layoutKey] ?? CHAR_LAYOUTS['en']

  const row0 = rows[0] || []
  const row1 = rows[1] || []
  const row2 = rows[2] || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, userSelect: 'none' }}>

      {/* ── Rows 1 & 2: Globe tall-left + character rows ── */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'stretch' }}>

        {/* Globe button — tall, spans rows 1+2 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
          <LanguageRow language={language} onLanguageChange={onLanguageChange} />
        </div>

        {/* Rows 1 and 2 stacked */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {row0.map((char, i) => <button key={i} onClick={() => onChar(char)} style={charKey}>{char}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {row1.map((char, i) => <button key={i} onClick={() => onChar(char)} style={charKey}>{char}</button>)}
          </div>
        </div>
      </div>

      {/* ── Row 3: Shift small-left + chars + ⌫ tall-right ── */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* Shift — small, left */}
        {language === 'en' && (
          <button onClick={onShiftToggle} style={shifted ? shiftKey('active') : shiftKey('default')}>⇧</button>
        )}

        {/* Row 3 chars */}
        <div style={{ flex: 1, display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {row2.map((char, i) => <button key={i} onClick={() => onChar(char)} style={charKey}>{char}</button>)}
        </div>

        {/* ⌫ — pink, right */}
        <button onClick={onDeleteChar} style={deleteKey}>
          {/* Backspace icon matching the image */}
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M8 1H20C20.6 1 21 1.4 21 2V14C21 14.6 20.6 15 20 15H8L1 8L8 1Z" stroke="#c0392b" strokeWidth="1.5" fill="none"/>
            <line x1="10" y1="5" x2="17" y2="11" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="17" y1="5" x2="10" y2="11" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Bottom row: Space + ↵ ── */}
      <div style={{ display: 'flex', gap: 5 }}>
        <button onClick={() => onChar(' ')} style={spaceKey}>space</button>
        <button onClick={() => onChar('\n')} style={enterKey}>↵</button>
      </div>

    </div>
  )
}

// ── Key styles ────────────────────────────────────────────────

const charKey = {
  height: 44, minWidth: 36, padding: '0 4px',
  borderRadius: 10,
  borderWidth: '1px', borderStyle: 'solid', borderColor: '#c8ddd0',
  cursor: 'pointer', fontSize: 16, fontWeight: 400,
  background: '#f4fbf7',
  color: '#1a3a2a',
  boxShadow: '0 1px 3px rgba(0,60,30,0.07)',
  transition: 'background 0.08s',
}

function shiftKey(state) {
  return {
    height: 44, minWidth: 48, padding: '0 10px',
    borderRadius: 10,
    borderWidth: '1px', borderStyle: 'solid',
    cursor: 'pointer', fontSize: 20, fontWeight: 600,
    background: state === 'active' ? '#c8f0e0' : '#f4fbf7',
    borderColor: state === 'active' ? '#4db896' : '#c8ddd0',
    color: state === 'active' ? '#0a6040' : '#3a6a5a',
    boxShadow: '0 1px 3px rgba(0,60,30,0.07)',
  }
}

const deleteKey = {
  height: 44, minWidth: 56, padding: '0 10px',
  borderRadius: 10,
  borderWidth: '1px', borderStyle: 'solid', borderColor: '#f0b8a8',
  cursor: 'pointer',
  background: '#fef0ee',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(160,40,20,0.08)',
}

const spaceKey = {
  flex: 1, height: 44, padding: '0 12px',
  borderRadius: 10,
  borderWidth: '1px', borderStyle: 'solid', borderColor: '#c8ddd0',
  cursor: 'pointer', fontSize: 14, fontWeight: 500,
  background: '#f4fbf7', color: '#2a5a3a',
  boxShadow: '0 1px 3px rgba(0,60,30,0.07)',
}

const enterKey = {
  height: 44, minWidth: 56, padding: '0 12px',
  borderRadius: 10,
  borderWidth: '1px', borderStyle: 'solid', borderColor: '#c8ddd0',
  cursor: 'pointer', fontSize: 18,
  background: '#f4fbf7', color: '#2a5a3a',
  boxShadow: '0 1px 3px rgba(0,60,30,0.07)',
}