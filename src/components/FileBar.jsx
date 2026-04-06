// ============================================================
//  FileBar.jsx
//  File management: New / Save / Save As / Open
//
//  Props:
//    currentFile   – filename of the currently open file, or null
//    segments      – the current segments array (styled text) to save
//    onOpen        – called with (segments, filename) when a file is opened
//    onNew         – called with no args to clear the editor
//    onFileChange  – called with a filename to update currentFile in App
// ============================================================

import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '../data/useLocalStorage.js'

export default function FileBar({ currentFile, segments, onOpen, onNew, onFileChange }) {
  const { saveFile, loadFile, listFiles } = useLocalStorage()

  const [savedFiles,   setSavedFiles]   = useState([])
  const [showOpenList, setShowOpenList] = useState(false)
  const [message,      setMessage]      = useState('')
  const [isError,      setIsError]      = useState(false)

  // Refresh file list on mount and every time the dropdown opens
  useEffect(() => {
    setSavedFiles(listFiles())
  }, [showOpenList])

  function showMsg(msg, error = false) {
    setMessage(msg)
    setIsError(error)
    setTimeout(() => setMessage(''), 2500)
  }

  // ── New ──────────────────────────────────────────────────────
  // Clears the editor immediately. Name is only asked when saving.
  function handleNew() {
    onNew()
    showMsg('New file — press Save when ready')
  }

  // ── Save ─────────────────────────────────────────────────────
  // If a file is already open (currentFile is set), save directly to it.
  // If no file is open yet (new unsaved file), ask for a name first.
  function handleSave() {
    if (currentFile) {
      // File already has a name — just overwrite it
      saveFile(currentFile, segments)
      setSavedFiles(listFiles())
      showMsg(`Saved "${currentFile}"`)
    } else {
      // No name yet — ask for one, then save
      const name = window.prompt('Save — enter a file name:', 'untitled')
      if (!name || name.trim() === '') return
      saveFile(name.trim(), segments)
      onFileChange(name.trim())      // tell App the file now has a name
      setSavedFiles(listFiles())
      showMsg(`Saved "${name.trim()}"`)
    }
  }

  // ── Save As ──────────────────────────────────────────────────
  // Always asks for a name. Saves under the new name.
  // The old file (if any) stays in localStorage untouched.
  function handleSaveAs() {
    const name = window.prompt('Save As — enter a file name:', currentFile || 'untitled')
    if (!name || name.trim() === '') return
    saveFile(name.trim(), segments)
    onFileChange(name.trim())        // current file is now the new name
    setSavedFiles(listFiles())
    showMsg(`Saved as "${name.trim()}"`)
  }

  // ── Open ─────────────────────────────────────────────────────
  // Loads a file from the list and sends it up to App.
  function handleOpenFile(filename) {
    const loaded = loadFile(filename)
    if (!loaded) {
      showMsg('Could not load file.', true)
      return
    }
    onOpen(loaded, filename)         // App sets segments + currentFile
    setShowOpenList(false)
    showMsg(`Opened "${filename}"`)
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div>

      {/* Button bar */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Current file indicator */}
        <span style={{ fontSize: 13, color: '#555', minWidth: 110 }}>
          {currentFile
            ? <span>📄 <strong>{currentFile}</strong></span>
            : <span style={{ color: '#aaa' }}>No file open</span>
          }
        </span>

        <button onClick={handleNew}                           style={btn('gray')}>📝 New</button>
        <button onClick={handleSave}                          style={btn('green')}>💾 Save</button>
        <button onClick={handleSaveAs}                        style={btn('green')}>💾 Save As</button>
        <button onClick={() => setShowOpenList(v => !v)}      style={btn('blue')}>
          📂 Open {showOpenList ? '▲' : '▼'}
        </button>

        {/* Feedback message */}
        {message && (
          <span style={{
            fontSize: 12, padding: '3px 10px', borderRadius: 6,
            background: isError ? '#FCEBEB' : '#EAF3DE',
            color:      isError ? '#A32D2D' : '#3B6D11',
          }}>
            {message}
          </span>
        )}
      </div>

      {/* File list dropdown */}
      {showOpenList && (
        <div style={{
          marginTop: 6, background: '#fff',
          borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#e0ddd6',
          borderRadius: 10, padding: 8,
          display: 'flex', flexDirection: 'column', gap: 4,
          maxHeight: 200, overflowY: 'auto',
        }}>
          {savedFiles.length === 0
            ? <span style={{ fontSize: 13, color: '#aaa', padding: '4px 8px' }}>No saved files yet.</span>
            : savedFiles.map(filename => (
                <div
                  key={filename}
                  onClick={() => handleOpenFile(filename)}
                  style={{
                    padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 13,
                    background:  currentFile === filename ? '#E6F1FB' : '#f8f8f8',
                    borderWidth: '1px', borderStyle: 'solid',
                    borderColor: currentFile === filename ? '#85B7EB' : '#e0ddd6',
                    color: '#1a1a1a',
                  }}
                >
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