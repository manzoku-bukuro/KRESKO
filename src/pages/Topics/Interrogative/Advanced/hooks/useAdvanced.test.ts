import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAdvanced } from './useAdvanced'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    interrogativeAdvanced: {
      title: '疑問詞応用問題',
      description: 'Test description',
    },
  },
}))

describe('useAdvanced', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns quiz questions', () => {
    const { result } = renderHook(() => useAdvanced())
    expect(result.current.quizQuestions.length).toBeGreaterThan(0)
    expect(result.current.quizQuestions[0]).toHaveProperty('esperanto')
    expect(result.current.quizQuestions[0]).toHaveProperty('japanese')
  })

  it('provides navigation handler', () => {
    const { result } = renderHook(() => useAdvanced())
    expect(typeof result.current.onNavigateToMenu).toBe('function')
  })

  it('provides choice pool generator', () => {
    const { result } = renderHook(() => useAdvanced())
    const pool = result.current.generateChoicePool(result.current.quizQuestions)
    expect(Array.isArray(pool)).toBe(true)
  })
})