import React, { useState } from 'react'

export default function ActionRow({ onDeleteChar, onDeleteWord, onClearAll, onUndo,
                    onSearch, onReplace, onReplaceAll }) {
  const [showSearchReplace, setShowSearchReplace] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [matchInfo, setMatchInfo] = useState({}) // { docName: count, ... }

  function handleSearch() {
    if (!searchTerm.trim()) return
    const info = onSearch(searchTerm)
    setMatchInfo(info)
  }

  function handleReplace() {
    if (!searchTerm.trim()) return
    onReplace(searchTerm, replaceTerm)
    handleSearch()
  }

  function handleReplaceAll() {
    if (!searchTerm.trim()) return
    onReplaceAll(searchTerm, replaceTerm)
    setMatchInfo({})
  }

  const totalMatches = Object.values(matchInfo).reduce((sum, count) => sum + count, 0)

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

      {/* Search & Replace Popup - Bottom Positioned */}
      {showSearchReplace && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          borderRadius: 14,
          padding: '16px',
          width: '90%',
          maxWidth: 400,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 2000,
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {/* Close button */}
          <button
            onClick={() => setShowSearchReplace(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1a3a2a', paddingRight: 24 }}>
            Find & Replace
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>
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
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #c0ddd0',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            {totalMatches > 0 && (
              <div style={{ fontSize: 10, color: '#4db896', marginTop: 6 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Total: {totalMatches} match{totalMatches !== 1 ? 'es' : ''}
                </div>
                {Object.entries(matchInfo).map(([docName, count]) => (
                  <div key={docName} style={{ fontSize: 9, color: '#5a8a7a', marginLeft: 8 }}>
                    • {docName}: {count} match{count !== 1 ? 'es' : ''}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Replace Input */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, color: '#5a8a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>
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
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #c0ddd0',
                fontSize: 12,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
            <button onClick={handleSearch} style={{ ...btn('search'), width: '100%' }}>
              🔍 Find All
            </button>
            <button
              onClick={handleReplace}
              disabled={!searchTerm.trim()}
              style={{
                ...btn('action'),
                width: '100%',
                opacity: !searchTerm.trim() ? 0.5 : 1,
                cursor: !searchTerm.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Replace Next
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={!searchTerm.trim()}
              style={{
                ...btn('danger'),
                width: '100%',
                opacity: !searchTerm.trim() ? 0.5 : 1,
                cursor: !searchTerm.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Replace All Documents
            </button>
            <button onClick={() => setShowSearchReplace(false)} style={{ ...btn('gray'), width: '100%' }}>
              Close
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
  if (variant === 'gray') return { ...base, background: '#f4f8f6', borderColor: '#b8ccc4', color: '#3a5a4a' }
  return base
}

