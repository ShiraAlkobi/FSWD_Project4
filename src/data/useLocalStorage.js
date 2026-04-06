const PREFIX  = 'vte_file_'
const VERSION = 1

export function useLocalStorage() {

  function saveFile(filename, segments) {
    const data = { version: VERSION, segments }
    localStorage.setItem(PREFIX + filename, JSON.stringify(data))
  }

  function loadFile(filename) {
    const raw = localStorage.getItem(PREFIX + filename)
    if (!raw) return null
    try {
      const data = JSON.parse(raw)
      if (!data.segments) {
        // Old plain-text format — wrap in a default segment
        return [{ text: String(data), font: 'sans', size: 'md', bold: false, italic: false, underline: false, color: 'black' }]
      }
      return data.segments
    } catch {
      return null
    }
  }

  function listFiles() {
    const files = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(PREFIX)) files.push(key.replace(PREFIX, ''))
    }
    return files.sort()
  }

  return { saveFile, loadFile, listFiles }
}