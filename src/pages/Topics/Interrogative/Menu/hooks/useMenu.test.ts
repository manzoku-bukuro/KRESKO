import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMenu } from './useMenu'
import * as seo from '../../../../../utils/seo'

// Mock dependencies
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    interrogativeMenu: {
      title: '疑問詞学習メニュー',
      description: 'Test description',
    },
  },
}))

describe('useMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updatePageMeta on mount', () => {
    renderHook(() => useMenu())

    expect(seo.updatePageMeta).toHaveBeenCalledWith(
      '疑問詞学習メニュー',
      'Test description'
    )
  })

  it('provides navigation handlers', () => {
    const { result } = renderHook(() => useMenu())

    expect(typeof result.current.onNavigateToExplanation).toBe('function')
    expect(typeof result.current.onNavigateToBasic).toBe('function')
    expect(typeof result.current.onNavigateToAdvanced).toBe('function')
    expect(typeof result.current.onNavigateToTop).toBe('function')
  })

  it('navigates to explanation when handler is called', () => {
    const { result } = renderHook(() => useMenu())

    result.current.onNavigateToExplanation()

    expect(mockNavigate).toHaveBeenCalledWith('/interrogative-explanation')
  })

  it('navigates to basic when handler is called', () => {
    const { result } = renderHook(() => useMenu())

    result.current.onNavigateToBasic()

    expect(mockNavigate).toHaveBeenCalledWith('/interrogative-basic')
  })

  it('navigates to advanced when handler is called', () => {
    const { result } = renderHook(() => useMenu())

    result.current.onNavigateToAdvanced()

    expect(mockNavigate).toHaveBeenCalledWith('/interrogative-advanced')
  })

  it('navigates to top when handler is called', () => {
    const { result } = renderHook(() => useMenu())

    result.current.onNavigateToTop()

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})