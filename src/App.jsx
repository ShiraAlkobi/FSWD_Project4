import React, { useState } from 'react'

import { FONTS, SIZES, COLORS } from './data/keyboardData.js'
import { useLocalStorage } from './data/useLocalStorage.js'
import { useAuth } from './data/useAuth.js'
import FileBar       from './components/FileBar.jsx'
import AuthModal     from './components/AuthModal.jsx'
import StyleRow      from './components/StyleRow.jsx'
import ColorRow      from './components/ColorRow.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'
import DocumentWindow from './components/DocumentWindow.jsx'
import ActionRow     from './components/ActionRow.jsx'

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

  // ── Auth state ────────────────────────────────────────────────
  const { getCurrentUser, logout } = useAuth()
  const { getCurrentUser: getCurrentUserFromStorage } = useLocalStorage()
  const [currentUser,   setCurrentUser]   = useState(() => getCurrentUserFromStorage() || getCurrentUser())
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  // ── Documents state ───────────────────────────────────────────
  const [documents,   setDocuments]   = useState([])
  const [activeDocId, setActiveDocId] = useState(null)

  const { saveFile } = useLocalStorage()

  const activeDoc = documents.find(d => d.id === activeDocId)
  const segments  = activeDoc?.segments || []
  const history   = activeDoc?.history  || []

  function handleAuthSuccess(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
    setShowAuthModal(false)
  }

  function handleLogout() {
    logout()
    setCurrentUser(null)
    // Clear all documents and reset state
    setDocuments([])
    setActiveDocId(null)
    setLanguage('en')
    setShifted(false)
    setFont('sans')
    setSize('md')
    setBold(false)
    setItalic(false)
    setUnderline(false)
    setColor('black')
    setStyleScope('from-now')
  }

  // ── Snapshot ──────────────────────────────────────────────────
  function saveSnapshot() {
    if (!activeDocId) return
    setDocuments(prev => prev.map(doc =>
      doc.id !== activeDocId ? doc : {
        ...doc,
        history: [...doc.history.slice(-49), { segments: doc.segments, font, size, bold, italic, underline, color }]
      }
    ))
  }

  // ── New text ──────────────────────────────────────────────────
  function handleNewText() {
    const newDoc = { id: generateDocId(), filename: `Untitled ${documents.length + 1}`, segments: [], history: [] }
    setDocuments(prev => [...prev, newDoc])
    setActiveDocId(newDoc.id)
  }

  // ── Close doc ─────────────────────────────────────────────────
  function handleCloseDoc(docId) {
    const docToClose = documents.find(d => d.id === docId)
    const plainText  = segmentsToPlainText(docToClose?.segments || [])

    if (plainText.length > 0) {
      if (!window.confirm('Save this text before closing?')) {
        closeDoc(docId)
        return
      }
      if (!currentUser) {
        setShowAuthModal(true)
        return
      }
      saveFile(docToClose.filename || 'untitled', docToClose.segments, currentUser)
    }
    closeDoc(docId)
  }

  function closeDoc(docId) {
    setDocuments(prev => prev.filter(d => d.id !== docId))
    if (activeDocId === docId) {
      const remaining = documents.filter(d => d.id !== docId)
      setActiveDocId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  // ── Char handler ──────────────────────────────────────────────
  function handleChar(char) {
    if (!activeDocId) return
    saveSnapshot()
    const currentStyle = makeStyle(font, size, bold, italic, underline, color)
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc
      const segs = doc.segments
      if (segs.length > 0) {
        const last = segs[segs.length - 1]
        if (last.font === currentStyle.font && last.size === currentStyle.size &&
            last.bold === currentStyle.bold && last.italic === currentStyle.italic &&
            last.underline === currentStyle.underline && last.color === currentStyle.color) {
          return { ...doc, segments: [...segs.slice(0, -1), { ...last, text: last.text + char }] }
        }
      }
      return { ...doc, segments: [...segs, { ...currentStyle, text: char }] }
    }))
    if (shifted && language === 'en') setShifted(false)
  }

  // ── Delete / Clear / Undo ─────────────────────────────────────
  function handleDeleteChar() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId || doc.segments.length === 0) return doc
      const last = doc.segments[doc.segments.length - 1]
      const newSegs = last.text.length === 1
        ? doc.segments.slice(0, -1)
        : [...doc.segments.slice(0, -1), { ...last, text: last.text.slice(0, -1) }]
      return { ...doc, segments: newSegs }
    }))
  }

  function handleDeleteWord() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc
      const plain = segmentsToPlainText(doc.segments)
      const trimmed = plain.trimEnd()

      // Find the last newline to determine current line start
      const lastNewlineIdx = trimmed.lastIndexOf('\n')
      const currentLineStart = lastNewlineIdx + 1
      const currentLine = trimmed.slice(currentLineStart)

      // Find the last space in current line only
      const lastSpaceInLine = currentLine.lastIndexOf(' ')

      let keep
      if (lastSpaceInLine === -1) {
        // No space in current line, delete entire current line
        keep = trimmed.slice(0, currentLineStart)
      } else {
        // Delete from last space to end of current line
        keep = trimmed.slice(0, currentLineStart + lastSpaceInLine + 1)
      }

      return { ...doc, segments: rebuildToLength(doc.segments, keep.length) }
    }))
  }

  function handleClear() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev => prev.map(doc =>
      doc.id === activeDocId ? { ...doc, segments: [] } : doc
    ))
  }``

  function handleUndo() {
    if (!activeDocId || history.length === 0) return
    const prev = history[history.length - 1]
    setDocuments(h => h.map(doc =>
      doc.id !== activeDocId ? doc : { ...doc, segments: prev.segments, history: doc.history.slice(0, -1) }
    ))
    setFont(prev.font); setSize(prev.size); setBold(prev.bold)
    setItalic(prev.italic); setUnderline(prev.underline); setColor(prev.color)
  }

  // ── Search and Replace ────────────────────────────────────────
  function handleSearch(searchTerm) {
    if (!searchTerm) return {}

    const matchInfo = {}

    // Search in all documents
    documents.forEach(doc => {
      const plain = segmentsToPlainText(doc.segments)
      let count = 0
      let index = 0
      while ((index = plain.indexOf(searchTerm, index)) !== -1) {
        count++
        index += searchTerm.length
      }
      if (count > 0) {
        matchInfo[doc.filename || 'Untitled'] = count
      }
    })

    return matchInfo
  }

  function handleReplace(searchTerm, replaceTerm) {
    if (!activeDocId || !searchTerm) return
    saveSnapshot()
    const plain = segmentsToPlainText(segments)
    const firstIndex = plain.indexOf(searchTerm)

    if (firstIndex === -1) return

    // Get the style from the replaced text
    let charCount = 0
    let replaceStyle = null
    for (const seg of segments) {
      if (charCount + seg.text.length > firstIndex) {
        replaceStyle = { font: seg.font, size: seg.size, bold: seg.bold, italic: seg.italic, underline: seg.underline, color: seg.color }
        break
      }
      charCount += seg.text.length
    }

    const before = plain.slice(0, firstIndex)
    const after = plain.slice(firstIndex + searchTerm.length)
    const newPlain = before + replaceTerm + after

    const newSegments = rebuildWithReplaceStyle(segments, newPlain, firstIndex, searchTerm.length, replaceTerm.length, replaceStyle)
    setDocuments(prev => prev.map(doc =>
      doc.id === activeDocId ? { ...doc, segments: newSegments } : doc
    ))
  }

  function handleReplaceAll(searchTerm, replaceTerm) {
    if (!searchTerm) return
    saveSnapshot()

    // Replace in all documents
    setDocuments(prev => prev.map(doc => {
      const plain = segmentsToPlainText(doc.segments)
      if (!plain.includes(searchTerm)) return doc

      let newPlain = plain
      let offset = 0
      let collectedSegments = [...doc.segments]

      // Find all matches and collect their styles
      let index = 0
      while ((index = plain.indexOf(searchTerm, index)) !== -1) {
        let charCount = 0
        let replaceStyle = null

        // Get style from original text
        for (const seg of collectedSegments) {
          if (charCount + seg.text.length > index) {
            replaceStyle = { font: seg.font, size: seg.size, bold: seg.bold, italic: seg.italic, underline: seg.underline, color: seg.color }
            break
          }
          charCount += seg.text.length
        }

        // Rebuild segments with replacement and style
        const before = newPlain.slice(0, index + offset)
        const after = newPlain.slice(index + offset + searchTerm.length)
        newPlain = before + replaceTerm + after

        collectedSegments = rebuildWithReplaceStyle(collectedSegments, newPlain, index + offset, searchTerm.length, replaceTerm.length, replaceStyle)

        offset += (replaceTerm.length - searchTerm.length)
        index += searchTerm.length
      }

      return { ...doc, segments: collectedSegments }
    }))
  }
  function handleStyleChange(setter, value, field) {
    if (!activeDocId) return
    saveSnapshot()
    setter(value)
    if (styleScope === 'all') {
      setDocuments(prev => prev.map(doc =>
        doc.id !== activeDocId ? doc
          : { ...doc, segments: doc.segments.map(seg => ({ ...seg, [field]: value })) }
      ))
    }
  }

  // ── File handlers ─────────────────────────────────────────────
  function handleOpenFile(loadedSegments, filename) {
    const newDoc = { id: generateDocId(), filename, segments: loadedSegments, history: [] }
    setDocuments(prev => [...prev, newDoc])
    setActiveDocId(newDoc.id)
  }

  function handleNewFile() {
    setFont('sans'); setSize('md'); setBold(false)
    setItalic(false); setUnderline(false); setColor('black'); setStyleScope('from-now')
    setDocuments([]); setActiveDocId(null)
  }

  function handleUpdateDocumentFilename(filename) {
    if (!activeDocId) return
    setDocuments(prev => prev.map(doc =>
      doc.id === activeDocId ? { ...doc, filename } : doc
    ))
  }

  const hr = { border: 'none', borderTop: '1px solid #d0e8d8', margin: 0 }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '8px 12px', fontFamily: "'Segoe UI', system-ui, sans-serif", boxSizing: 'border-box', gap: 6, background: '#f0f7f2' }}>

      {showAuthModal && <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuthModal(false)} />}

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 12, padding: '6px 12px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0' }}>
        <div style={{ flex: 1 }}>
          <FileBar
            currentFile={activeDoc?.filename?.startsWith('Untitled') ? null : activeDoc?.filename || null}
            segments={segments} onOpen={handleOpenFile} onNew={handleNewFile}
            onFileChange={handleUpdateDocumentFilename}
            currentUser={currentUser} onSaveBlocked={() => setShowAuthModal(true)}
          />
        </div>

        {/* User pill */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e0f5ef', borderRadius: 20, padding: '4px 12px 4px 5px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#4db896' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#4db896,#2a7abf)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                {(currentUser.username || currentUser)[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: '#0a6040', fontWeight: 600 }}>{currentUser.username || currentUser}</span>
            </div>
            <button onClick={handleLogout} style={logoutBtn}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)} style={signInBtn}>👤 Sign In</button>
        )}
      </div>

      {/* ── Document area ── */}
      {documents.length === 0 ? (
        <div style={{ flex: 1, background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          <div style={{ textAlign: 'center', color: '#8ab8a0', fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
            Click <strong>New Text</strong> below to start editing
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, background: '#e8f5ee', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', borderRadius: 14, padding: 10,
          display: 'grid',
          gridTemplateColumns: documents.length <= 2 ? `repeat(${documents.length}, 1fr)` : 'repeat(3, 1fr)',
          gap: 10, minHeight: 0, overflow: 'auto',
        }}>
          {documents.map(doc => (
            <DocumentWindow key={doc.id} doc={doc} isActive={doc.id === activeDocId}
              onSelect={() => setActiveDocId(doc.id)} onClose={() => handleCloseDoc(doc.id)} size={size} />
          ))}
        </div>
      )}

      {/* ── Bottom panel: 3 columns ── */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>

        {/* Style + Color */}
        <div style={{ background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, width: 320, flexShrink: 0, overflow: 'auto', maxHeight: 220 }}>
          <StyleRow
            font={font}           onFontChange={v  => handleStyleChange(setFont,      v, 'font')}
            size={size}           onSizeChange={v  => handleStyleChange(setSize,      v, 'size')}
            bold={bold}           onBoldToggle={()  => handleStyleChange(setBold,      !bold,      'bold')}
            italic={italic}       onItalicToggle={()=> handleStyleChange(setItalic,    !italic,    'italic')}
            underline={underline} onUnderlineToggle={()=> handleStyleChange(setUnderline, !underline, 'underline')}
            styleScope={styleScope} onStyleScopeChange={setStyleScope}
          />
          <div style={hr} />
          <ColorRow color={color} onColorChange={v => handleStyleChange(setColor, v, 'color')} />
        </div>

        {/* Keyboard */}
        <div style={{ flex: 1, minWidth: 0, background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', borderRadius: 12, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <CharacterGrid
            language={language} shifted={shifted}
            onShiftToggle={() => setShifted(!shifted)}
            onChar={handleChar}
            onDeleteChar={handleDeleteChar}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Actions */}
        <div style={{ background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5, width: 200, flexShrink: 0 }}>
          <button onClick={handleNewText}  style={aBtn('blue')}>➕ New Text</button>
          <div style={{ fontSize: 9, color: '#8ab8a0', textAlign: 'center' }}>{documents.length} open</div>
          <div style={hr} />
          <ActionRow
            onDeleteChar={handleDeleteChar}
            onDeleteWord={handleDeleteWord}
            onClearAll={handleClear}
            onUndo={handleUndo}
            onSearch={handleSearch}
            onReplace={handleReplace}
            onReplaceAll={handleReplaceAll}
          />
        </div>

      </div>
    </div>
  )
}

function aBtn(color) {
  const base = { padding: '6px 8px', borderRadius: 8, borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', fontSize: 11, width: '100%', fontWeight: 500 }
  if (color === 'blue')  return { ...base, background: '#e8f2fb', borderColor: '#7ab0d8', color: '#0a3a6a', fontSize: 13 }
  if (color === 'purple') return { ...base, background: '#EEEDFE', borderColor: '#7F77DD', color: '#3C3489' }
  if (color === 'red')   return { ...base, background: '#fef0ee', borderColor: '#f0a090', color: '#8a2010' }
  if (color === 'green') return { ...base, background: '#e0f5ef', borderColor: '#4db896', color: '#0a5030' }
  return base
}

const signInBtn = { height: 32, padding: '0 14px', borderRadius: 8, borderWidth: '1px', borderStyle: 'solid', borderColor: '#4db896', background: '#e0f5ef', color: '#0a5030', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }
const logoutBtn = { height: 28, padding: '0 10px', borderRadius: 7, borderWidth: '1px', borderStyle: 'solid', borderColor: '#c0ddd0', background: '#f4f8f6', color: '#6a8a7a', fontSize: 12, cursor: 'pointer' }


function rebuildToLength(segments, targetLength) {
  const result = []
  let count = 0
  for (const seg of segments) {
    if (count >= targetLength) break
    const canTake = targetLength - count
    if (seg.text.length <= canTake) { result.push(seg); count += seg.text.length }
    else { result.push({ ...seg, text: seg.text.slice(0, canTake) }); count = targetLength }
  }
  return result
}


function rebuildWithReplaceStyle(segments, newPlainText, replaceIndex, oldLength, newLength, replaceStyle) {
  const result = [];
  const delta = newLength - oldLength; // How much the text shifted (+ or -)
  
  let currentPos = 0;

  for (const seg of segments) {
    const segOldStart = currentPos;
    const segOldEnd = currentPos + seg.text.length;
    currentPos = segOldEnd; // Keep track of original positions

    let segNewStart, segNewEnd;

    // 1. Segment is entirely BEFORE the replacement
    if (segOldEnd <= replaceIndex) {
      segNewStart = segOldStart;
      segNewEnd = segOldEnd;
      result.push({ ...seg, text: newPlainText.slice(segNewStart, segNewEnd) });
    } 
    // 2. Segment contains or overlaps the START of the replacement
    else if (segOldStart <= replaceIndex && segOldEnd > replaceIndex) {
      // Piece before replacement
      if (replaceIndex > segOldStart) {
        result.push({ ...seg, text: newPlainText.slice(segOldStart, replaceIndex) });
      }
      // The replacement itself (using the captured style)
      result.push({ ...replaceStyle, text: newPlainText.slice(replaceIndex, replaceIndex + newLength) });
      
      // Piece after replacement (if any remains in this segment)
      if (segOldEnd > replaceIndex + oldLength) {
        const remainingInSeg = newPlainText.slice(replaceIndex + newLength, segOldEnd + delta);
        if (remainingInSeg) result.push({ ...seg, text: remainingInSeg });
      }
    }
    // 3. Segment is entirely AFTER the replacement
    else if (segOldStart >= replaceIndex + oldLength) {
      segNewStart = segOldStart + delta;
      segNewEnd = segOldEnd + delta;
      result.push({ ...seg, text: newPlainText.slice(segNewStart, segNewEnd) });
    }
  }

  // Final cleanup: Merge adjacent segments with identical styles to keep data clean
  return result.filter(s => s.text.length > 0);
}