import React, { useState } from 'react'

import { FONTS, SIZES, COLORS } from './data/KeyboardData.js'
import TextPreview   from './components/TextPreview.jsx'
import FileBar       from './components/FileBar.jsx'
import LanguageRow   from './components/LanguageRow.jsx'
import StyleRow      from './components/StyleRow.jsx'
import ColorRow      from './components/ColorRow.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'
import ActionRow     from './components/ActionRow.jsx'

export default function App() {

  // Style state
  const [language,  setLanguage]  = useState('en')
  const [shifted,   setShifted]   = useState(false)
  const [font,      setFont]      = useState('sans')
  const [size,      setSize]      = useState('md')
  const [bold,      setBold]      = useState(false)
  const [italic,    setItalic]    = useState(false)
  const [underline, setUnderline] = useState(false)
  const [color,     setColor]     = useState('black')

  // Text state
  const [text,    setText]    = useState('')
  const [history, setHistory] = useState([])

  // File state (Part B)
  const [currentFile, setCurrentFile] = useState(null)

  // Text handlers
  function updateText(newText) {
    setHistory(prev => [...prev.slice(-49), text])
    setText(newText)
  }

  function handleChar(char) {
    updateText(text + char)
    if (shifted && language === 'en') setShifted(false)
  }

  function handleDeleteChar() { updateText(text.slice(0, -1)) }

  function handleDeleteWord() {
    const trimmed = text.trimEnd()
    const lastSpace = trimmed.lastIndexOf(' ')
    updateText(lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1))
  }

  function handleClear() { updateText('') }

  function handleUndo() {
    if (history.length === 0) return
    setText(history[history.length - 1])
    setHistory(prev => prev.slice(0, -1))
  }

  // File handler (Part B)
  // Called by FileBar when the user opens a saved file
  function handleOpenFile(loadedText, filename) {
    setText(loadedText)
    setHistory([])
    setCurrentFile(filename)
  }

  // Derive preview style
  const activeFont  = FONTS.find(f => f.id === font)
  const activeSize  = SIZES.find(s => s.id === size)
  const activeColor = COLORS.find(c => c.id === color)

  const textStyle = {
    fontFamily:     activeFont?.css  ?? 'sans-serif',
    fontSize:       activeSize?.px   ?? 16,
    fontWeight:     bold      ? 700  : 400,
    fontStyle:      italic    ? 'italic'    : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    color:          activeColor?.hex ?? '#1a1a1a',
  }

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>

      {/* File bar — sits at the top */}
      <FileBar
        currentFile={currentFile}
        text={text}
        onOpen={handleOpenFile}
        onFileChange={setCurrentFile}
      />

      {/* Preview */}
      <TextPreview text={text} textStyle={textStyle} />

      {/* Keyboard panel */}
      <div style={{ background: '#f8f7f4', border: '1.5px solid #e0ddd6', borderRadius: 14, padding: '12px 14px' }}>

        <LanguageRow language={language} onLanguageChange={setLanguage} />
        <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '8px 0' }} />

        <StyleRow
          font={font}           onFontChange={setFont}
          size={size}           onSizeChange={setSize}
          bold={bold}           onBoldToggle={() => setBold(!bold)}
          italic={italic}       onItalicToggle={() => setItalic(!italic)}
          underline={underline} onUnderlineToggle={() => setUnderline(!underline)}
        />
        <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '8px 0' }} />

        <ColorRow color={color} onColorChange={setColor} />
        <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '8px 0' }} />

        <CharacterGrid
          language={language} shifted={shifted}
          onShiftToggle={() => setShifted(!shifted)}
          onChar={handleChar}
        />
        <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '8px 0' }} />

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