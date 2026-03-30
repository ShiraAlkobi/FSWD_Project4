// ============================================================
//  FileBar.jsx
//  Handles Save / Save As / Open from localStorage.
//
//  Props:
//    currentFile   – name of the currently open file (or null)
//    text          – current text in the editor (to save)
//    onOpen        – called with (text, filename) when user opens a file
//    onFileChange  – called with filename when current file name changes
// ============================================================

import React, { useState } from 'react'
import { useLocalStorage } from '../data/useLocalStorage.js'

export default function FileBar({ currentFile, text, onOpen, onFileChange }) {
  const { saveFile, loadFile, listFiles } = useLocalStorage()

  const [savedFiles,   setSavedFiles]   = useState(() => listFiles()) // list of filenames in LS
  const [showOpenList, setShowOpenList] = useState(false) // toggle the open dropdown
  const [message,      setMessage]      = useState('')    // feedback message ("Saved!")

  // Refresh from localStorage when user actions may have changed available files.
  function refreshSavedFiles() {
    setSavedFiles(listFiles())
  }

  // Show a temporary feedback message for 2 seconds
  function showMessage(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  // ── Save ────────────────────────────────────────────────────
  // Saves to the current file. If no file is open yet, acts as Save As.
  function handleSave() {
    if (!currentFile) {
      handleSaveAs()
      return
    }
    saveFile(currentFile, text)
    refreshSavedFiles()
    showMessage(`Saved to "${currentFile}"`)
  }

  // ── Save As ─────────────────────────────────────────────────
  // Asks the user for a new filename via a simple prompt, then saves.
  function handleSaveAs() {
    const filename = window.prompt('Save as — enter a file name:', currentFile || 'my-text')
    if (!filename) return                    // user cancelled
    if (filename.trim() === '') return       // empty name
    saveFile(filename.trim(), text)
    refreshSavedFiles()
    onFileChange(filename.trim())            // update the current file name in App
    showMessage(`Saved as "${filename.trim()}"`)
  }

  // ── Open ────────────────────────────────────────────────────
  // Shows a dropdown list of all saved files, loads the one clicked.
  function handleOpenFile(filename) {
    const loaded = loadFile(filename)
    if (loaded === null) {
      showMessage('File not found.')
      return
    }
    onOpen(loaded, filename)                 // send text + filename up to App
    setShowOpenList(false)
    showMessage(`Opened "${filename}"`)
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ marginBottom: 10 }}>

      {/* Top bar: current filename + buttons */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Current file indicator */}
        <span style={{ fontSize: 13, color: '#555', minWidth: 120 }}>
          {currentFile
            ? <span>📄 <strong>{currentFile}</strong></span>
            : <span style={{ color: '#aaa' }}>No file open</span>
          }
        </span>

        {/* Save */}
        <button onClick={handleSave} style={{ ...btnBase, ...greenStyle }}>
          💾 Save
        </button>

        {/* Save As */}
        <button onClick={handleSaveAs} style={{ ...btnBase, ...greenStyle }}>
          💾 Save As
        </button>

        {/* Open — toggles the file list below */}
        <button
          onClick={() => {
            const nextOpen = !showOpenList
            if (nextOpen) refreshSavedFiles()
            setShowOpenList(nextOpen)
          }}
          style={{ ...btnBase, ...blueStyle }}
        >
          📂 Open {showOpenList ? '▲' : '▼'}
        </button>

        {/* Feedback message */}
        {message && (
          <span style={{ fontSize: 12, color: '#3B6D11', background: '#EAF3DE', padding: '3px 10px', borderRadius: 6 }}>
            {message}
          </span>
        )}
      </div>

      {/* File list dropdown — only shown when Open is clicked */}
      {showOpenList && (
        <div style={{
          marginTop: 8, background: '#fff', border: '1.5px solid #e0ddd6',
          borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 4
        }}>

          {/* Conditional rendering: empty state vs file list */}
          {savedFiles.length === 0
            ? <span style={{ fontSize: 13, color: '#aaa', padding: '4px 8px' }}>No saved files yet.</span>
            : savedFiles.map(filename => (
                <button
                  key={filename}
                  onClick={() => handleOpenFile(filename)}
                  style={{
                    textAlign: 'left', padding: '6px 10px', borderRadius: 7,
                    border: '1px solid #e0ddd6', background: currentFile === filename ? '#E6F1FB' : '#fff',
                    color: '#1a1a1a', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  📄 {filename}
                </button>
              ))
          }

        </div>
      )}
    </div>
  )
}

const btnBase   = { height: 32, padding: '0 12px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13 }
const greenStyle = { background: '#EAF3DE', borderColor: '#97C459', color: '#3B6D11' }
const blueStyle  = { background: '#E6F1FB', borderColor: '#85B7EB', color: '#185FA5' }