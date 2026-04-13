// ============================================================
//  useAuth.js
//  Simple client-side auth using localStorage.
//
//  Current logged-in user is stored under 'currentUser'.
//  All registered users are stored under 'users'.
// ============================================================

export function useAuth() {

  // Returns the currently logged-in user object, or null
  function getCurrentUser() {
    const raw = localStorage.getItem('currentUser')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  // Returns all registered users as an array of { username, password, files }
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]')
    } catch {
      return []
    }
  }

  // Register a new user — returns { ok, error }
  function register(username, password) {
    const trimmed = username.trim()
    if (!trimmed)    return { ok: false, error: 'Username cannot be empty' }
    if (!password)   return { ok: false, error: 'Password cannot be empty' }

    const users = getUsers()
    if (users.find(u => u.username === trimmed)) {
      return { ok: false, error: 'Username already taken' }
    }

    const newUser = { username: trimmed, password, files: {} }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    return { ok: true }
  }

  // Login — returns { ok, error }
  function login(username, password) {
    const trimmed = username.trim()
    const users = getUsers()
    const user = users.find(u => u.username === trimmed && u.password === password)
    if (!user) return { ok: false, error: 'Wrong username or password' }

    localStorage.setItem('currentUser', JSON.stringify(user))
    return { ok: true }
  }

  // Logout
  function logout() {
    localStorage.removeItem('currentUser')
  }

  return { getCurrentUser, register, login, logout }
}