import { describe, it, expect, beforeEach } from 'vitest'
import { signUp, logIn, logOut, getCurrentSession } from '@/src/lib/auth'

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('signUp creates a new user and returns a session', () => {
    const result = signUp('test@example.com', 'password123')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.session.email).toBe('test@example.com')
      expect(result.session.userId).toBeTruthy()
    }
  })

  it('signUp returns an error when email already exists', () => {
    signUp('test@example.com', 'password123')
    const result = signUp('test@example.com', 'otherpassword')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('User already exists')
    }
  })

  it('logIn returns a session for valid credentials', () => {
    signUp('login@example.com', 'mypassword')
    const result = logIn('login@example.com', 'mypassword')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.session.email).toBe('login@example.com')
    }
  })

  it('logIn returns an error for invalid credentials', () => {
    const result = logIn('nobody@example.com', 'wrongpassword')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Invalid email or password')
    }
  })

  it('logOut clears the current session', () => {
    signUp('logout@example.com', 'password123')
    expect(getCurrentSession()).not.toBeNull()
    logOut()
    expect(getCurrentSession()).toBeNull()
  })

  it('getCurrentSession returns null when no session exists', () => {
    expect(getCurrentSession()).toBeNull()
  })

  it('getCurrentSession returns the active session after login', () => {
    signUp('session@example.com', 'password123')
    const session = getCurrentSession()
    expect(session).not.toBeNull()
    expect(session?.email).toBe('session@example.com')
  })
})
