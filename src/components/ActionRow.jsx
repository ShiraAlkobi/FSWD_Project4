import React, { useState } from 'react'

export default function ActionRow({ onDeleteChar, onDeleteWord, onClearAll, onUndo, onSearch, onReplace, onReplaceAll }) {
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [matchCount, setMatchCount] = useState(0)

  function handleSearch() {
    if (!searchTerm.trim()) return
    const count = onSearch(searchTerm)
    setMatchCount(count)
  }

  function handleReplace() {
    if (!searchTerm.trim() || !replaceTerm.trim()) return
    onReplace(searchTerm, replaceTerm)
    handleSearch() // Update match count
  }

  function handleReplaceAll() {
    if (!searchTerm.trim()) return
    onReplaceAll(searchTerm, replaceTerm)
    setMatchCount(0)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={onDeleteChar} style={btn('danger')}>⌫ Char</button>
        <button onClick={onDeleteWord} style={btn('danger')}>⌫ Word</button>
        <button onClick={onClearAll}   style={btn('danger')}>✕ Clear</button>
        <span style={{ display: 'inline-block', width: 1, height: 22, background: '#e0ddd6', alignSelf: 'center' }} />
        <button onClick={onUndo}       style={btn('action')}>↩ Undo</button>
        <span style={{ display: 'inline-block', width: 1, height: 22, background: '#e0ddd6', alignSelf: 'center' }} />
        <button onClick={() => setShowSearchReplace(!showSearchReplace)} style={btn('search')}>🔍 Find & Replace</button>
      </div>

      {/* Search & Replace Panel */}
      {showSearchReplace && (
        <div style={{
          marginTop: 10,
          padding: 10,
          background: '#f9fdfb',
          borderRadius: 10,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#c0ddd0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {/* Search Input */}
          <div>
            <label style={{ fontSize: 11, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>
              Find
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter text to find..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #c0ddd0',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            {matchCount > 0 && (
              <div style={{ fontSize: 10, color: '#4db896', marginTop: 3 }}>
                {matchCount} match{matchCount !== 1 ? 'es' : ''} found in current document
              </div>
            )}
          </div>

          {/* Replace Input */}
          <div>
            <label style={{ fontSize: 11, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>
              Replace with
            </label>
            <input
              type="text"
              value={replaceTerm}
              onChange={e => setReplaceTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReplace()}
              placeholder="Enter replacement text..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #c0ddd0',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={handleSearch} style={{ ...btn('search'), flex: 1 }}>
              Find All
            </button>
            <button
              onClick={handleReplace}
              disabled={!searchTerm.trim()}
              style={{ ...btn('action'), flex: 1, opacity: !searchTerm.trim() ? 0.5 : 1, cursor: !searchTerm.trim() ? 'not-allowed' : 'pointer' }}
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={!searchTerm.trim()}
              style={{ ...btn('danger'), flex: 1, opacity: !searchTerm.trim() ? 0.5 : 1, cursor: !searchTerm.trim() ? 'not-allowed' : 'pointer' }}
            >
              Replace All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function btn(variant) {
  const base = { height: 32, padding: '0 12px', borderRadius: 8, borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 13 }
  if (variant === 'danger') return { ...base, background: '#FCEBEB', borderColor: '#F09595', color: '#A32D2D' }
  if (variant === 'action') return { ...base, background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }
  if (variant === 'search') return { ...base, background: '#EEEDFE', borderColor: '#7F77DD', color: '#3C3489' }
  return base
}
