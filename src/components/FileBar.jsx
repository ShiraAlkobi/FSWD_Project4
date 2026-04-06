import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '../data/useLocalStorage.js'

// Props:
//   currentFile, segments, onOpen, onNew, onFileChange  — same as before
//   currentUser    – logged-in username, or null
//   onSaveBlocked  – called when user tries to save without being logged in

export default function FileBar({ currentFile, segments, onOpen, onNew, onFileChange, currentUser, onSaveBlocked }) {
  const { saveFile, loadFile, listFiles } = useLocalStorage()

  const [savedFiles,   setSavedFiles]   = useState([])
  const [showOpenList, setShowOpenList] = useState(false)
  const [message,      setMessage]      = useState('')
  const [isError,      setIsError]      = useState(false)

  useEffect(() => {
    setSavedFiles(listFiles(currentUser))
  }, [showOpenList, currentUser])

  function showMsg(msg, error = false) {
    setMessage(msg); setIsError(error)
    setTimeout(() => setMessage(''), 2500)
  }

  // Guard — if not logged in, block save and open auth modal
  function requireUser() {
    if (!currentUser) { onSaveBlocked(); return false }
    return true
  }

  function handleNew() {
    onNew()
    showMsg('New file — press Save when ready')
  }

  function handleSave() {
    if (!requireUser()) return
    if (currentFile) {
      saveFile(currentFile, segments, currentUser)
      setSavedFiles(listFiles(currentUser))
      showMsg(`Saved "${currentFile}"`)
    } else {
      const name = window.prompt('Save — enter a file name:', 'untitled')
      if (!name || name.trim() === '') return
      saveFile(name.trim(), segments, currentUser)
      onFileChange(name.trim())
      setSavedFiles(listFiles(currentUser))
      showMsg(`Saved "${name.trim()}"`)
    }
  }

  function handleSaveAs() {
    if (!requireUser()) return
    const name = window.prompt('Save As — enter a file name:', currentFile || 'untitled')
    if (!name || name.trim() === '') return
    saveFile(name.trim(), segments, currentUser)
    onFileChange(name.trim())
    setSavedFiles(listFiles(currentUser))
    showMsg(`Saved as "${name.trim()}"`)
  }

  function handleOpenFile(filename) {
    if (!requireUser()) return
    const loaded = loadFile(filename, currentUser)
    if (!loaded) { showMsg('Could not load file.', true); return }
    onOpen(loaded, filename)
    setShowOpenList(false)
    showMsg(`Opened "${filename}"`)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>

        <span style={{ fontSize: 13, color: '#555', minWidth: 110 }}>
          {currentFile
            ? <span>📄 <strong>{currentFile}</strong></span>
            : <span style={{ color: '#aaa' }}>No file open</span>
          }
        </span>

        <button onClick={handleNew}                      style={btn('gray')}>📝 New</button>
        <button onClick={handleSave}                     style={btn('green')}>💾 Save</button>
        <button onClick={handleSaveAs}                   style={btn('green')}>💾 Save As</button>
        <button onClick={() => setShowOpenList(v => !v)} style={btn('blue')}>
          📂 Open {showOpenList ? '▲' : '▼'}
        </button>

        {/* "Save requires login" hint when not logged in */}
        {!currentUser && (
          <span style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>
            Sign in to save files
          </span>
        )}

        {message && (
          <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: isError ? '#FCEBEB' : '#EAF3DE', color: isError ? '#A32D2D' : '#3B6D11' }}>
            {message}
          </span>
        )}
      </div>

      {showOpenList && (
        <div style={{ marginTop: 6, background: '#fff', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#e0ddd6', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
          {!currentUser
            ? <span style={{ fontSize: 13, color: '#aaa', padding: '4px 8px', fontStyle: 'italic' }}>Sign in to see your files.</span>
            : savedFiles.length === 0
              ? <span style={{ fontSize: 13, color: '#aaa', padding: '4px 8px' }}>No saved files yet.</span>
              : savedFiles.map(filename => (
                  <div key={filename} onClick={() => handleOpenFile(filename)} style={{ padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 13, background: currentFile === filename ? '#E6F1FB' : '#f8f8f8', borderWidth: '1px', borderStyle: 'solid', borderColor: currentFile === filename ? '#85B7EB' : '#e0ddd6', color: '#1a1a1a' }}>
                    📄 {filename}
                  </div>
                ))
          }
        </div>
      )}
    </div>
  )
}

function btn(color) {
  const base = { height: 30, padding: '0 10px', borderRadius: 7, borderWidth: '1.5px', borderStyle: 'solid', cursor: 'pointer', fontSize: 12 }
  if (color === 'green') return { ...base, background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }
  if (color === 'blue')  return { ...base, background: '#E6F1FB', borderColor: '#85B7EB', color: '#185FA5' }
  if (color === 'gray')  return { ...base, background: '#f4f4f4', borderColor: '#d0d0d0', color: '#444'    }
  return base
}