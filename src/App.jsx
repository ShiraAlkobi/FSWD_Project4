import React, { useState } from 'react'

import { FONTS, SIZES, COLORS } from './data/keyboardData.js'
import { useLocalStorage } from './data/useLocalStorage.js'
import { useAuth } from './data/useAuth.js'
import FileBar       from './components/FileBar.jsx'
import AuthModal     from './components/AuthModal.jsx'
import LanguageRow   from './components/LanguageRow.jsx'
import StyleRow      from './components/StyleRow.jsx'
import ColorRow      from './components/ColorRow.jsx'
import CharacterGrid from './components/CharacterGrid.jsx'

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
      const plain    = segmentsToPlainText(doc.segments)
      const trimmed  = plain.trimEnd()
      const lastSpace = trimmed.lastIndexOf(' ')
      const keep     = lastSpace === -1 ? '' : trimmed.slice(0, lastSpace + 1)
      return { ...doc, segments: rebuildToLength(doc.segments, keep.length) }
    }))
  }

  function handleClear() {
    if (!activeDocId) return
    saveSnapshot()
    setDocuments(prev => prev.map(doc =>
      doc.id === activeDocId ? { ...doc, segments: [] } : doc
    ))
  }

  function handleUndo() {
    if (!activeDocId || history.length === 0) return
    const prev = history[history.length - 1]
    setDocuments(h => h.map(doc =>
      doc.id !== activeDocId ? doc : { ...doc, segments: prev.segments, history: doc.history.slice(0, -1) }
    ))
    setFont(prev.font); setSize(prev.size); setBold(prev.bold)
    setItalic(prev.italic); setUnderline(prev.underline); setColor(prev.color)
  }

  // ── Style handler ─────────────────────────────────────────────
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

  const hrStyle = { border: 'none', borderTop: '1px solid #e0ddd6', margin: 0 }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '8px 12px', fontFamily: 'sans-serif', boxSizing: 'border-box', gap: 6 }}>

      {/* Auth modal overlay */}
      {showAuthModal && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Top bar: FileBar + User area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <FileBar
            currentFile={activeDoc?.filename?.startsWith('Untitled') ? null : activeDoc?.filename || null}
            segments={segments}
            onOpen={handleOpenFile}
            onNew={handleNewFile}
            onFileChange={handleUpdateDocumentFilename}
            currentUser={currentUser}
            onSaveBlocked={() => setShowAuthModal(true)}
          />
        </div>

        {/* User area — top right */}
        {currentUser
          ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Profile icon + username */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#E6F1FB', borderRadius: 20, padding: '4px 12px 4px 6px',
                borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#85B7EB',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#185FA5', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: '#185FA5', fontWeight: 500 }}>{currentUser.username}</span>
              </div>
              <button onClick={handleLogout} style={logoutBtn}>Sign Out</button>
            </div>
          )
          : (
            <button onClick={() => setShowAuthModal(true)} style={signInBtn}>
              👤 Sign In
            </button>
          )
        }
      </div>

      {/* Document display area */}
      {documents.length === 0 ? (
        <div style={{ flex: 1, background: '#f8f7f4', border: '1.5px solid #e0ddd6', borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          <div style={{ textAlign: 'center', color: '#bbb', fontStyle: 'italic', fontSize: 14 }}>
            Click "New Text" below to start editing
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, background: '#f8f7f4', border: '1.5px solid #e0ddd6', borderRadius: 14, padding: 12,
          display: 'grid',
          gridTemplateColumns: documents.length <= 2 ? `repeat(${documents.length}, 1fr)` : 'repeat(3, 1fr)',
          gap: 10, minHeight: 0, overflow: 'auto'
        }}>
          {documents.map(doc => (
            <DocumentWindow
              key={doc.id} doc={doc}
              isActive={doc.id === activeDocId}
              onSelect={() => setActiveDocId(doc.id)}
              onClose={() => handleCloseDoc(doc.id)}
            />
          ))}
        </div>
      )}

      {/* Bottom panel */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>

        {/* Style controls */}
        <div style={{ background: '#fff', border: '1.5px solid #e0ddd6', borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, width: 180, flexShrink: 0, overflow: 'auto', maxHeight: 200 }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Styles</div>
          <StyleRow
            font={font}           onFontChange={v  => handleStyleChange(setFont,      v, 'font')}
            size={size}           onSizeChange={v  => handleStyleChange(setSize,      v, 'size')}
            bold={bold}           onBoldToggle={()  => handleStyleChange(setBold,      !bold,      'bold')}
            italic={italic}       onItalicToggle={()=> handleStyleChange(setItalic,    !italic,    'italic')}
            underline={underline} onUnderlineToggle={()=> handleStyleChange(setUnderline, !underline, 'underline')}
            styleScope={styleScope} onStyleScopeChange={setStyleScope}
          />
          <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '4px 0' }} />
          <ColorRow color={color} onColorChange={v => handleStyleChange(setColor, v, 'color')} />
        </div>

        {/* Keyboard */}
        <div style={{ flex: 1, minWidth: 0, background: '#fff', border: '1.5px solid #e0ddd6', borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Keyboard</div>
          <LanguageRow language={language} onLanguageChange={setLanguage} />
          <hr style={hrStyle} />
          <CharacterGrid language={language} shifted={shifted} onShiftToggle={() => setShifted(!shifted)} onChar={handleChar} />
        </div>

        {/* Actions */}
        <div style={{ background: '#fff', border: '1.5px solid #e0ddd6', borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6, width: 140, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Actions</div>
          <button onClick={handleNewText} style={actionBtn('blue')}>➕ New Text</button>
          <div style={{ fontSize: 9, color: '#999', textAlign: 'center' }}>{documents.length} open</div>
          <hr style={{ border: 'none', borderTop: '1px solid #e0ddd6', margin: '2px 0' }} />
          <button onClick={handleDeleteChar} style={actionBtn('red')}>⌫ Char</button>
          <button onClick={handleDeleteWord} style={actionBtn('red')}>⌫ Word</button>
          <button onClick={handleClear}      style={actionBtn('red')}>✕ Clear</button>
          <button onClick={handleUndo}       style={actionBtn('green')}>↩ Undo</button>
        </div>

      </div>
    </div>
  )
}

// ── Button style helpers ──────────────────────────────────────
function actionBtn(color) {
  const base = { padding: '4px 8px', borderRadius: 6, borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', fontSize: 10, width: '100%' }
  if (color === 'blue')  return { ...base, background: '#EEF4FF', borderColor: '#7FA3D8', color: '#1E40AF', fontWeight: 'bold' }
  if (color === 'red')   return { ...base, background: '#FCEBEB', borderColor: '#F09595', color: '#A32D2D' }
  if (color === 'green') return { ...base, background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }
  return base
}

const signInBtn  = { height: 32, padding: '0 14px', borderRadius: 8, borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#85B7EB', background: '#E6F1FB', color: '#185FA5', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }
const logoutBtn  = { height: 28, padding: '0 10px', borderRadius: 7, borderWidth: '1px', borderStyle: 'solid', borderColor: '#e0ddd6', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }

// ── DocumentWindow ────────────────────────────────────────────
function DocumentWindow({ doc, isActive, onSelect, onClose }) {
  const [cursorOn, setCursorOn] = React.useState(true)
  React.useEffect(() => {
    const t = setInterval(() => setCursorOn(p => !p), 500)
    return () => clearInterval(t)
  }, [])

  function segmentStyle(seg) {
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
    <div onClick={onSelect} style={{ background: '#fff', border: `1.5px solid ${isActive ? '#7F77DD' : '#e0ddd6'}`, borderRadius: 10, padding: '8px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120, position: 'relative', boxShadow: isActive ? '0 0 0 2px #EEEDFE' : 'none' }}>
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{ position: 'absolute', top: 4, right: 4, background: '#ffebee', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ef5350', borderRadius: 4, width: 24, height: 24, cursor: 'pointer', color: '#c62828', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
      >✕</button>
      <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', paddingRight: 30 }}>
        {doc.filename || 'Untitled'}
      </div>
      <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: 1.4, fontSize: 11, flex: 1, overflow: 'hidden' }}>
        {isEmpty
          ? <span style={{ color: '#bbb', fontStyle: 'italic', fontSize: 10 }}>Empty…</span>
          : <>{doc.segments.map((seg, i) => <span key={i} style={segmentStyle(seg)}>{seg.text}</span>)}
              {isActive && <span style={{ display: 'inline-block', width: 1.5, height: '1.1em', background: cursorOn ? '#333' : 'transparent', marginLeft: 1, verticalAlign: 'text-bottom' }} />}
            </>
        }
      </div>
    </div>
  )
}

// ── rebuildToLength ───────────────────────────────────────────
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