import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useExplanation } from './useExplanation'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    interrogativeExplanation: {
      title: '疑問詞の説明',
      description: 'Test description',
    },
  },
}))

describe('useExplanation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns interrogatives data', () => {
    const { result } = renderHook(() => useExplanation())
    expect(result.current.interrogatives).toHaveLength(9)
  })

  it('provides navigation handlers', () => {
    const { result } = renderHook(() => useExplanation())
    expect(typeof result.current.onNavigateToBasic).toBe('function')
    expect(typeof result.current.onNavigateToAdvanced).toBe('function')
    expect(typeof result.current.onNavigateToMenu).toBe('function')
  })
})