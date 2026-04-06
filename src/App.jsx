import React, { useState } from 'react'

import { FONTS, SIZES, COLORS } from './data/keyboardData.js'
import { useLocalStorage } from './data/useLocalStorage.js'
import FileBar       from './components/FileBar.jsx'
import LanguageRow   from './components/LanguageRow.jsx'
import StyleRow      from './components/StyleRow.jsx'
import ColorRow      from './components/ColorRow.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'

// ── Segment helpers ───────────────────────────────────────────
// Text is stored as an array of segments: [{ text, font, size, bold, italic, underline, color }, ...]
// This lets "from now" apply a new style only to newly typed characters.

function makeStyle(font, size, bold, italic, underline, color) {
  return { font, size, bold, italic, underline, color }
}

function segmentsToPlainText(segments) {
  return segments.map(s => s.text).join('')
}

function generateDocId() {
  return '_doc_' + Math.random().toString(36).substr(2, 9)
}

export default function App() {

  // ── Style state ───────────────────────────────────────────────
  const [language,   setLanguage]   = useState('en')
  const [shifted,    setShifted]    = useState(false)
  const [font,       setFont]       = useState('sans')
  const [size,       setSize]       = useState('md')
  const [bold,       setBold]       = useState(false)
  const [italic,     setItalic]     = useState(false)
  const [underline,  setUnderline]  = useState(false)
  const [color,      setColor]      = useState('black')
  const [styleScope, setStyleScope] = useState('from-now')

  // ── Multiple documents state ─────────────────────────────────
  const [documents, setDocuments]   = useState([])  // [{ id, filename, segments, history }]
  const [activeDocId, setActiveDocId] = useState(null)

  // ── localStorage helper ──────────────────────────────────────
  const { saveFile } = useLocalStorage()

  // ── Current document (convenience) ───────────────────────────
  const activeDoc = documents.find(d => d.id === activeDocId)
  const segments = activeDoc?.segments || []
  const history = activeDoc?.history || []

  // ── Snapshot: save current full state before any action ──────
  function saveSnapshot() {
    if (!activeDocId) return
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === activeDocId
          ? { ...doc, history: [...doc.history.slice(-49), { segments: doc.segments, font, size, bold, italic, underline, color }] }
          : doc
      )
    )
  }

  // ── Create new text document ─────────────────────────────────
  function handleNewText() {
    const newDoc = {
      id: generateDocId(),
      filename: `Untitled ${documents.length + 1}`,
      segments: [],
      history: []
    }
    setDocuments(prev => [...prev, newDoc])
    setActiveDocId(newDoc.id)
  }

  // ── Close document ───────────────────────────────────────────
  function handleCloseDoc(docId) {
    const docToClose = documents.find(d => d.id === docId)
    const plainText = segmentsToPlainText(docToClose?.segments || [])

    if (plainText.length > 0) {
      if (!window.confirm('Save this text to a file before closing?')) {
        setDocuments(prev => prev.filter(d => d.id !== docId))
        if (activeDocId === docId) {
          const remaining = documents.filter(d => d.id !== docId)
          setActiveDocId(remaining.length > 0 ? remaining[0].id : null)
        }
        return
      }
      // Save to localStorage
      saveFile(docToClose.filename || 'untitled', docToClose.segments)
    }

    setDocuments(prev => prev.filter(d => d.id !== docId))
    if (activeDocId === docId) {
      const remaining = documents.filter(d => d.id !== docId)
      setActiveDocId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  // ── Select/activate document ─────────────────────────────────
  function handleSelectDoc(docId) {
    setActiveDocId(docId)
  }

  // ── Char handler ─────────────────────────────────────────────
  function handleChar(char) {
    if (!activeDocId) return
    saveSnapshot()
    const currentStyle = makeStyle(font, size, bold, italic, underline, color)

    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== activeDocId) return doc

        const newSegments = doc.segments.length > 0
          ? (() => {
              const last = doc.segments[doc.segments.length - 1]
              if (
                last.font === currentStyle.font &&
                last.size === currentStyle.size &&
                last.bold === currentStyle.bold &&
                last.italic === currentStyle.italic &&
                last.underline === currentStyle.underline &&
                last.color === currentStyle.color
              ) {
                return [...doc.segments.slice(0, -1), { ...last, text: last.text + char }]
              }
              return [...doc.segments, { ...currentStyle, text: char }]
            })()
          : [{ ...currentStyle, text: char }]

        return { ...doc, segments: newSegments }
      })
    )

    if (shifted && language === 'en') setShifted(false)
  }

  // ── Delete char ───────────────────────────────────────────────
  function handleDeleteChar() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== activeDocId) return doc
        if (doc.segments.length === 0) return doc

        const last = doc.segments[doc.segments.length - 1]
        const newSegments = last.text.length === 1
          ? doc.segments.slice(0, -1)
          : [...doc.segments.slice(0, -1), { ...last, text: last.text.slice(0, -1) }]

        return { ...doc, segments: newSegments }
      })
    )
  }

  // ── Delete word ───────────────────────────────────────────────
  function handleDeleteWord() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== activeDocId) return doc

        const plain = segmentsToPlainText(doc.segments)
        const trimmed = plain.trimEnd()
        const lastSpace = trimmed.lastIndexOf(' ')
        const keep = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1)
        const newSegments = rebuildToLength(doc.segments, keep.length)

        return { ...doc, segments: newSegments }
      })
    )
  }

  // ── Clear ─────────────────────────────────────────────────────
  function handleClear() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === activeDocId
          ? { ...doc, segments: [] }
          : doc
      )
    )
  }

  // ── Undo ──────────────────────────────────────────────────────
  function handleUndo() {
    if (!activeDocId || history.length === 0) return

    const prevSnapshot = history[history.length - 1]
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id !== activeDocId) return doc
        return {
          ...doc,
          segments: prevSnapshot.segments,
          history: doc.history.slice(0, -1)
        }
      })
    )
    setFont(prevSnapshot.font)
    setSize(prevSnapshot.size)
    setBold(prevSnapshot.bold)
    setItalic(prevSnapshot.italic)
    setUnderline(prevSnapshot.underline)
    setColor(prevSnapshot.color)
  }

  // ── Style handlers ────────────────────────────────────────────
  function handleStyleChange(setter, value, field) {
    if (!activeDocId) return
    saveSnapshot()
    setter(value)

    // If scope is "all", re-style every segment
    if (styleScope === 'all') {
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === activeDocId
            ? { ...doc, segments: doc.segments.map(seg => ({ ...seg, [field]: value })) }
            : doc
        )
      )
    }
  }

  // ── File handler ──────────────────────────────────────────────
  function handleOpenFile(loadedSegments, filename) {
    const newDoc = {
      id: generateDocId(),
      filename,
      segments: loadedSegments,
      history: []
    }
    setDocuments(prev => [...prev, newDoc])
    setActiveDocId(newDoc.id)
  }

  // New file: clear editor and set filename
  function handleNewFile() {
    setFont("sans")
    setSize("md")
    setBold(false)
    setItalic(false)
    setUnderline(false)
    setColor("black")
    setStyleScope("from-now")
    setDocuments([])
    setActiveDocId(null)
  }

  // ── Update document filename ───────────────────────────────────
  function handleUpdateDocumentFilename(filename) {
    if (!activeDocId) return
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === activeDocId
          ? { ...doc, filename }
          : doc
      )
    )
  }

  // Plain text for saving
  const plainText = segmentsToPlainText(segments)

  const hrStyle = { border: 'none', borderTop: '1px solid #e0ddd6', margin: 0 }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '8px 12px', fontFamily: 'sans-serif', boxSizing: 'border-box', gap: 6,
    }}>

      <FileBar currentFile={activeDoc?.filename?.startsWith('Untitled') ? null : activeDoc?.filename || null} segments={segments} onOpen={handleOpenFile}
        onNew={handleNewFile}
        onFileChange={handleUpdateDocumentFilename} />

      {/* Multiple text display areas */}
      {documents.length === 0 ? (
        <div style={{
          flex: 1, background: '#f8f7f4', border: '1.5px solid #e0ddd6',
          borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center',
          justifyContent: 'center', minHeight: 0, overflow: 'hidden'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#bbb',
            fontStyle: 'italic',
            fontSize: 14
          }}>
            Click "New Text" below to start editing
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, background: '#f8f7f4', border: '1.5px solid #e0ddd6',
          borderRadius: 14, padding: 12, display: 'grid',
          gridTemplateColumns: documents.length <= 2 ? `repeat(${documents.length}, 1fr)` : 'repeat(3, 1fr)',
          gap: 10, minHeight: 0, overflow: 'auto'
        }}>
          {documents.map(doc => (
            <DocumentWindow
              key={doc.id}
              doc={doc}
              isActive={doc.id === activeDocId}
              onSelect={() => handleSelectDoc(doc.id)}
              onClose={() => handleCloseDoc(doc.id)}
            />
          ))}
        </div>
      )}

      {/* Bottom panel: 3 columns */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexShrink: 0,
        height: 'auto'
      }}>

        {/* Column 1: Style Controls */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e0ddd6',
          borderRadius: 10,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: 180,
          flexShrink: 0,
          overflow: 'auto',
          maxHeight: 200
        }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Styles
          </div>
          <StyleRow
            font={font}
            onFontChange={v => handleStyleChange(setFont, v, 'font')}
            size={size}
            onSizeChange={v => handleStyleChange(setSize, v, 'size')}
            bold={bold}
            onBoldToggle={() => handleStyleChange(setBold, !bold, 'bold')}
            italic={italic}
            onItalicToggle={() => handleStyleChange(setItalic, !italic, 'italic')}
            underline={underline}
            onUnderlineToggle={() => handleStyleChange(setUnderline, !underline, 'underline')}
            styleScope={styleScope}
            onStyleScopeChange={setStyleScope}
          />
          <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '4px 0' }} />
          <ColorRow color={color} onColorChange={v => handleStyleChange(setColor, v, 'color')} />
        </div>

        {/* Column 2: Keyboard */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          border: '1.5px solid #e0ddd6',
          borderRadius: 10,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Keyboard
          </div>
          <LanguageRow language={language} onLanguageChange={setLanguage} />
          <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '4px 0' }} />
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <CharacterGrid
              language={language}
              shifted={shifted}
              onShiftToggle={() => setShifted(!shifted)}
              onChar={handleChar}
            />
          </div>
        </div>

        {/* Column 3: Actions */}
        <div style={{
          background: '#fff',
          border: '1.5px solid #e0ddd6',
          borderRadius: 10,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: 140,
          flexShrink: 0,
          overflow: 'auto',
          maxHeight: 200
        }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Actions
          </div>

          {/* New Text button */}
          <button
            onClick={handleNewText}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #7FA3D8',
              background: '#EEF4FF',
              color: '#1E40AF',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            ➕ New Text
          </button>

          {/* Document count */}
          <div style={{
            fontSize: 9,
            color: '#999',
            textAlign: 'center',
            padding: '2px 0'
          }}>
            {documents.length} open
          </div>

          {/* Separator */}
          <div style={{ borderTop: '1px solid #e0ddd6', margin: '2px 0' }} />

          {/* Text editing actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              onClick={handleDeleteChar}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #F09595',
                background: '#FCEBEB',
                color: '#A32D2D',
                cursor: 'pointer',
                fontSize: 10,
                width: '100%'
              }}
            >
              ⌫ Char
            </button>
            <button
              onClick={handleDeleteWord}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #F09595',
                background: '#FCEBEB',
                color: '#A32D2D',
                cursor: 'pointer',
                fontSize: 10,
                width: '100%'
              }}
            >
              ⌫ Word
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #F09595',
                background: '#FCEBEB',
                color: '#A32D2D',
                cursor: 'pointer',
                fontSize: 10,
                width: '100%'
              }}
            >
              ✕ Clear
            </button>
            <button
              onClick={handleUndo}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #97C459',
                background: '#EAF3DE',
                color: '#3B6D11',
                cursor: 'pointer',
                fontSize: 10,
                width: '100%'
              }}
            >
              ↩ Undo
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// Document window component - displays individual text document
function DocumentWindow({ doc, isActive, onSelect, onClose }) {
  const [cursorOn, setCursorOn] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => setCursorOn(prev => !prev), 500)
    return () => clearInterval(interval)
  }, [])

  function segmentStyle(seg) {
    const activeFont = FONTS.find(f => f.id === seg.font)
    const activeSize = SIZES.find(s => s.id === seg.size)
    const activeColor = COLORS.find(c => c.id === seg.color)
    return {
      fontFamily: activeFont?.css ?? 'sans-serif',
      fontSize: activeSize?.px ?? 12,
      fontWeight: seg.bold ? 700 : 400,
      fontStyle: seg.italic ? 'italic' : 'normal',
      textDecoration: seg.underline ? 'underline' : 'none',
      color: activeColor?.hex ?? '#1a1a1a',
    }
  }

  const isEmpty = !doc.segments || doc.segments.length === 0

  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff',
        border: `1.5px solid ${isActive ? '#7F77DD' : '#e0ddd6'}`,
        borderRadius: 10,
        padding: '8px 10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minHeight: 120,
        position: 'relative',
        boxShadow: isActive ? '0 0 0 2px #EEEDFE' : 'none',
        transition: 'all 0.2s'
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: '#ffebee',
          border: '1px solid #ef5350',
          borderRadius: 4,
          width: 24,
          height: 24,
          cursor: 'pointer',
          color: '#c62828',
          fontWeight: 'bold',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        ✕
      </button>

      {/* Document label and filename */}
      <div style={{
        fontSize: 10,
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        paddingRight: 30
      }}>
        {doc.filename || 'Untitled'}
      </div>

      {/* Text content */}
      <div style={{
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.4,
        fontSize: 11,
        color: '#333',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {isEmpty
          ? <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 10 }}>Empty…</span>
          : <>
              {doc.segments.map((seg, i) => (
                <span key={i} style={segmentStyle(seg)}>{seg.text}</span>
              ))}
              {isActive && (
                <span style={{
                  display: 'inline-block',
                  width: 1.5,
                  height: '1.1em',
                  background: cursorOn ? '#333' : 'transparent',
                  marginLeft: 1,
                  verticalAlign: 'text-bottom',
                }} />
              )}
            </>
        }
      </div>
    </div>
  )
}

// Trim segments array so total char count equals targetLength
function rebuildToLength(segments, targetLength) {
  const result = []
  let count = 0
  for (const seg of segments) {
    if (count >= targetLength) break
    const canTake = targetLength - count
    if (seg.text.length <= canTake) {
      result.push(seg)
      count += seg.text.length
    } else {
      result.push({ ...seg, text: seg.text.slice(0, canTake) })
      count = targetLength
    }
  }
  return result
}