import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '../data/useLocalStorage.js'

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
    setMessage(msg); 
    setIsError(error)
    setTimeout(() => setMessage(''), 2500)
  }

  function requireUser() {
    if (!currentUser) { onSaveBlocked(); return false }
    return true
  }

  function handleNew() { onNew(); showMsg('Cleared all content.') }

  function handleSave() {
    if (!requireUser()) return
    if (currentFile) {
      saveFile(currentFile, segments, currentUser)
      setSavedFiles(listFiles(currentUser))
      showMsg(`Saved "${currentFile}"`)
    } else {
      const name = window.prompt('File name:', 'untitled')
      if (!name?.trim()) return
      saveFile(name.trim(), segments, currentUser)
      onFileChange(name.trim())
      setSavedFiles(listFiles(currentUser))
      showMsg(`Saved "${name.trim()}"`)
    }
  }

  function handleSaveAs() {
    if (!requireUser()) return
    const name = window.prompt('Save as:', currentFile || 'untitled')
    if (!name?.trim()) return
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

        <button onClick={handleNew}                      style={btn('gray')}>Clear All</button>
        <button onClick={handleSave}                     style={btn('green')}>💾 Save</button>
        <button onClick={handleSaveAs}                   style={btn('green')}>Save As</button>
        <button onClick={() => setShowOpenList(v => !v)} style={btn('blue')}>
          📂 Open {showOpenList ? '▲' : '▼'}
        </button>

        {!currentUser && (
          <span style={{ fontSize: 11, color: '#7a9a8a', fontStyle: 'italic' }}>Sign in to save</span>
        )}

        {message && (
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: isError ? '#fef0ee' : '#e8f5ee', color: isError ? '#a03020' : '#0a6040' }}>
            {message}
          </span>
        )}
      </div>

      {showOpenList && (
        <div style={{ marginTop: 6, background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#b8d8c8', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 200, overflowY: 'auto' }}>
          {!currentUser
            ? <span style={{ fontSize: 12, color: '#9ab8a8', padding: '4px 8px', fontStyle: 'italic' }}>Sign in to see your files.</span>
            : savedFiles.length === 0
              ? <span style={{ fontSize: 12, color: '#9ab8a8', padding: '4px 8px' }}>No saved files yet.</span>
              : savedFiles.map(filename => (
                  <div key={filename} onClick={() => handleOpenFile(filename)}
                    style={{ padding: '6px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12,
                      background: currentFile === filename ? '#e0f5ef' : '#f4fbf7',
                      borderWidth: '1px', borderStyle: 'solid',
                      borderColor: currentFile === filename ? '#4db896' : '#c8e8d8',
                      color: '#1a3a2a', fontWeight: currentFile === filename ? 600 : 400 }}>
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
  const base = { height: 30, padding: '0 12px', borderRadius: 7, borderWidth: '1px', borderStyle: 'solid', cursor: 'pointer', fontSize: 12, fontWeight: 500 }
  if (color === 'green') return { ...base, background: '#e0f5ef', borderColor: '#4db896', color: '#0a6040' }
  if (color === 'blue')  return { ...base, background: '#e8f2fb', borderColor: '#7ab0d8', color: '#0a3a6a' }
  if (color === 'gray')  return { ...base, background: '#f4f8f6', borderColor: '#b8ccc4', color: '#3a5a4a' }
  return base
}