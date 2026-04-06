const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUser'
const VERSION = 1

export function useLocalStorage() {

  function getUsers() {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  function saveFile(filename, segments, currentUser) {
    if (!currentUser) return

    const users = getUsers()
    const userIndex = users.findIndex(u => u.username === currentUser.username)

    if (userIndex === -1) return

    // Update user's files
    if (!users[userIndex].files) {
      users[userIndex].files = {}
    }
    users[userIndex].files[filename] = { version: VERSION, segments }

    // Save updated users array
    saveUsers(users)

    // Update currentUser in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
  }

  function loadFile(filename, currentUser) {
    if (!currentUser) return null

    const users = getUsers()
    const user = users.find(u => u.username === currentUser.username)
    if (!user) return null

    const fileData = user.files?.[filename]
    if (!fileData) return null

    if (!fileData.segments) {
      // Old plain-text format — wrap in a default segment
      return [{ text: String(fileData), font: 'sans', size: 'md', bold: false, italic: false, underline: false, color: 'black' }]
    }
    return fileData.segments
  }

  function listFiles(currentUser) {
    if (!currentUser) return []

    const users = getUsers()
    const user = users.find(u => u.username === currentUser.username)
    if (!user) return []

    return Object.keys(user.files || {}).sort()
  }

  function getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  return { saveFile, loadFile, listFiles, getCurrentUser }
}
