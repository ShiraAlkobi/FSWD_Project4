// ============================================================
//  useLocalStorage.js
//  A simple custom hook that wraps localStorage.
//  Returns functions for save, load, and listing all saved files.
//
//  All files are stored under the key prefix "vte_file_"
//  so they don't clash with anything else in localStorage.
// ============================================================

const PREFIX = 'vte_file_'

export function useLocalStorage() {

  // Save a file — key is the filename, value is the text
  function saveFile(filename, text) {
    localStorage.setItem(PREFIX + filename, text)
  }

  // Load a file by filename — returns the text string, or null if not found
  function loadFile(filename) {
    return localStorage.getItem(PREFIX + filename)
  }

  // Returns an array of all saved filenames (without the prefix)
  function listFiles() {
    const files = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(PREFIX)) {
        files.push(key.replace(PREFIX, ''))
      }
    }
    return files
  }

  return { saveFile, loadFile, listFiles }
}