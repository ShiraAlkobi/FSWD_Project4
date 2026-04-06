// ============================================================
//  useAuth.js
//  Simple client-side auth using localStorage.
//
//  Users are stored as: { username, password }  (plain text —
//  this is intentionally basic as per the project requirements)
//
//  Current logged-in user is stored under 'current_user'.
//  All registered users are stored under 'users'.
// ============================================================

export function useAuth() {

  // Returns the currently logged-in username, or null
  function getCurrentUser() {
    return localStorage.getItem('current_user') || null
  }

  // Returns all registered users as an array of { username, password }
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

    users.push({ username: trimmed, password })
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('current_user', trimmed)
    return { ok: true }
  }

  // Login — returns { ok, error }
  function login(username, password) {
    const trimmed = username.trim()
    const users = getUsers()
    const user = users.find(u => u.username === trimmed && u.password === password)
    if (!user) return { ok: false, error: 'Wrong username or password' }

    localStorage.setItem('current_user', trimmed)
    return { ok: true }
  }

  // Logout
  function logout() {
    localStorage.removeItem('current_user')
  }

  return { getCurrentUser, register, login, logout }
}