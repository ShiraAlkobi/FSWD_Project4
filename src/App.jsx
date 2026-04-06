import React, { useState } from 'react'

import { FONTS, SIZES, COLORS } from './data/keyboardData.js'
import TextPreview   from './components/TextPreview.jsx'
import FileBar       from './components/FileBar.jsx'
import LanguageRow   from './components/LanguageRow.jsx'
import StyleRow      from './components/StyleRow.jsx'
import ColorRow      from './components/ColorRow.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'
import ActionRow     from './components/ActionRow.jsx'

// ── Segment helpers ───────────────────────────────────────────
// Text is stored as an array of segments: [{ text, font, size, bold, italic, underline, color }, ...]
// This lets "from now" apply a new style only to newly typed characters.

function makeStyle(font, size, bold, italic, underline, color) {
  return { font, size, bold, italic, underline, color }
}

function segmentsToPlainText(segments) {
  return segments.map(s => s.text).join('')
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

  // ── Text state — stored as segments ──────────────────────────
  const [segments, setSegments] = useState([])  // [{ text, font, size, bold, italic, underline, color }]
  const [history,  setHistory]  = useState([])  // each entry is a full { segments, font, size, bold, italic, underline, color }

  // ── File state ────────────────────────────────────────────────
  const [currentFile, setCurrentFile] = useState(null)

  // ── Snapshot: save current full state before any action ──────
  function saveSnapshot() {
    setHistory(prev => [...prev.slice(-49), { segments, font, size, bold, italic, underline, color }])
  }

  // ── Char handler ─────────────────────────────────────────────
  function handleChar(char) {
    saveSnapshot()
    const currentStyle = makeStyle(font, size, bold, italic, underline, color)

    setSegments(prev => {
      // If the last segment has the same style, just append to it
      if (prev.length > 0) {
        const last = prev[prev.length - 1]
        if (
          last.font === currentStyle.font &&
          last.size === currentStyle.size &&
          last.bold === currentStyle.bold &&
          last.italic === currentStyle.italic &&
          last.underline === currentStyle.underline &&
          last.color === currentStyle.color
        ) {
          return [...prev.slice(0, -1), { ...last, text: last.text + char }]
        }
      }
      // Otherwise start a new segment
      return [...prev, { ...currentStyle, text: char }]
    })

    if (shifted && language === 'en') setShifted(false)
  }

  // ── Delete char ───────────────────────────────────────────────
  function handleDeleteChar() {
    saveSnapshot()
    setSegments(prev => {
      if (prev.length === 0) return prev
      const last = prev[prev.length - 1]
      if (last.text.length === 1) return prev.slice(0, -1)           // remove the whole segment
      return [...prev.slice(0, -1), { ...last, text: last.text.slice(0, -1) }]
    })
  }

  // ── Delete word ───────────────────────────────────────────────
  function handleDeleteWord() {
    saveSnapshot()
    const plain = segmentsToPlainText(segments)
    const trimmed = plain.trimEnd()
    const lastSpace = trimmed.lastIndexOf(' ')
    const keep = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1)
    // Rebuild segments keeping only chars up to `keep.length`
    setSegments(prev => rebuildToLength(prev, keep.length))
  }

  // ── Clear ─────────────────────────────────────────────────────
  function handleClear() {
    saveSnapshot()
    setSegments([])
  }

  // ── Undo ──────────────────────────────────────────────────────
  function handleUndo() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setSegments(prev.segments)
    setFont(prev.font)
    setSize(prev.size)
    setBold(prev.bold)
    setItalic(prev.italic)
    setUnderline(prev.underline)
    setColor(prev.color)
    setHistory(h => h.slice(0, -1))
  }

  // ── Style handlers ────────────────────────────────────────────
  function handleStyleChange(setter, value, field) {
    saveSnapshot()
    setter(value)

    // If scope is "all", re-style every segment
    if (styleScope === 'all') {
      setSegments(prev => prev.map(seg => ({ ...seg, [field]: value })))
    }
    // If scope is 'from-now', new chars will naturally use the new style
  }

  // ── File handler ──────────────────────────────────────────────
  function handleOpenFile(loadedSegments, filename) {
    // Load plain text as a single unstyled segment
    setSegments(loadedSegments)
    setHistory([])
    setCurrentFile(filename)
  }

  // New file: clear editor and set filename
  function handleNewFile() {
    setSegments([])
    setHistory([])
    setCurrentFile(null)
    setFont("sans")
    setSize("md")
    setBold(false)
    setItalic(false)
    setUnderline(false)
    setColor("black")
    setStyleScope("from-now")
  }

  // Plain text for saving
  const plainText = segmentsToPlainText(segments)

  const hrStyle = { border: 'none', borderTop: '1px solid #e0ddd6', margin: 0 }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      padding: '8px 12px', fontFamily: 'sans-serif', boxSizing: 'border-box', gap: 6,
    }}>

      <FileBar currentFile={currentFile} segments={segments} onOpen={handleOpenFile}
        onNew={handleNewFile}
        onFileChange={setCurrentFile} />

      <TextPreview segments={segments} />

      <div style={{
        flex: 1, background: '#f8f7f4', border: '1.5px solid #e0ddd6',
        borderRadius: 14, padding: '10px 12px', display: 'flex',
        flexDirection: 'column', gap: 6, overflow: 'hidden', minHeight: 0,
      }}>

        <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 220, flexShrink: 0 }}>
            <LanguageRow language={language} onLanguageChange={setLanguage} />
            <hr style={hrStyle} />
            <StyleRow
              font={font}           onFontChange={v  => handleStyleChange(setFont,      v, 'font')}
              size={size}           onSizeChange={v  => handleStyleChange(setSize,      v, 'size')}
              bold={bold}           onBoldToggle={()  => handleStyleChange(setBold,      !bold,      'bold')}
              italic={italic}       onItalicToggle={()=> handleStyleChange(setItalic,    !italic,    'italic')}
              underline={underline} onUnderlineToggle={()=> handleStyleChange(setUnderline, !underline, 'underline')}
              styleScope={styleScope} onStyleScopeChange={setStyleScope}
            />
            <hr style={hrStyle} />
            <ColorRow color={color} onColorChange={v => handleStyleChange(setColor, v, 'color')} />
          </div>

          {/* Right column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <CharacterGrid
              language={language} shifted={shifted}
              onShiftToggle={() => setShifted(!shifted)}
              onChar={handleChar}
            />
          </div>

        </div>

        <hr style={hrStyle} />

        <ActionRow
          onDeleteChar={handleDeleteChar}
          onDeleteWord={handleDeleteWord}
          onClearAll={handleClear}
          onUndo={handleUndo}
        />

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