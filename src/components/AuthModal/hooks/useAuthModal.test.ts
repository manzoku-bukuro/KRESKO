import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthModal } from './useAuthModal'

describe('useAuthModal', () => {
  it('initializes with default mode', () => {
    const { result } = renderHook(() => useAuthModal())
    expect(result.current.mode).toBe('login')
  })

  it('initializes with provided default mode', () => {
    const { result } = renderHook(() => useAuthModal('signup'))
    expect(result.current.mode).toBe('signup')
  })

  it('switches to login mode', () => {
    const { result } = renderHook(() => useAuthModal('signup'))

    act(() => {
      result.current.switchToLogin()
    })

    expect(result.current.mode).toBe('login')
  })

  it('switches to signup mode', () => {
    const { result } = renderHook(() => useAuthModal('login'))

    act(() => {
      result.current.switchToSignup()
    })

    expect(result.current.mode).toBe('signup')
  })
})