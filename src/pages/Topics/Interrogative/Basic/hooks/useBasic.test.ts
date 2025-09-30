import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBasic } from './useBasic'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    interrogativeBasic: {
      title: '疑問詞基本学習',
      description: 'Test description',
    },
  },
}))

describe('useBasic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns interrogative questions', () => {
    const { result } = renderHook(() => useBasic())
    expect(result.current.interrogativeQuestions).toHaveLength(9)
    expect(result.current.interrogativeQuestions[0]).toHaveProperty('esperanto')
    expect(result.current.interrogativeQuestions[0]).toHaveProperty('japanese')
  })

  it('provides navigation handler', () => {
    const { result } = renderHook(() => useBasic())
    expect(typeof result.current.onNavigateToMenu).toBe('function')
  })

  it('provides choice pool generator', () => {
    const { result } = renderHook(() => useBasic())
    const pool = result.current.generateChoicePool()
    expect(pool).toHaveLength(9)
    expect(pool).toContain('何')
  })
})