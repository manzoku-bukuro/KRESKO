import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRangeSelect } from './useRangeSelect'

// Mock dependencies
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useParams: () => ({ category: 'esuken4' }),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    esuken4: {
      title: 'エス検4級',
      description: 'Test description',
    },
  },
}))

vi.mock('../../../../data/vortaro.json', () => ({
  default: Array(100).fill({ esperanto: 'test', japanese: 'テスト' }),
}))

vi.mock('../../../../data/esuken4.json', () => ({
  default: Array(500).fill({ vorto: 'test', 意味: 'テスト' }),
}))

describe('useRangeSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correct total for esuken4', () => {
    const { result } = renderHook(() => useRangeSelect())

    expect(result.current.total).toBe(500)
    expect(result.current.category).toBe('esuken4')
  })

  it('generates range options for 10 words', () => {
    const { result } = renderHook(() => useRangeSelect())

    expect(result.current.rangeOptions10).toHaveLength(50) // 500 / 10
    expect(result.current.rangeOptions10[0]).toEqual({ start: 1, size: 10 })
    expect(result.current.rangeOptions10[1]).toEqual({ start: 11, size: 10 })
  })

  it('generates range options for 100 words', () => {
    const { result } = renderHook(() => useRangeSelect())

    expect(result.current.rangeOptions100).toHaveLength(5) // 500 / 100
    expect(result.current.rangeOptions100[0]).toEqual({ start: 1, size: 100 })
    expect(result.current.rangeOptions100[1]).toEqual({ start: 101, size: 100 })
  })

  it('returns correct category emoji and name', () => {
    const { result } = renderHook(() => useRangeSelect())

    expect(result.current.categoryEmoji).toBe('🏆')
    expect(result.current.categoryName).toBe('エス検4級')
  })

  it('provides navigation handlers', () => {
    const { result } = renderHook(() => useRangeSelect())

    expect(typeof result.current.onSelectRange).toBe('function')
    expect(typeof result.current.onNavigateToTop).toBe('function')
  })

  it('navigates to quiz when range is selected', () => {
    const { result } = renderHook(() => useRangeSelect())

    result.current.onSelectRange(1, 10)

    expect(mockNavigate).toHaveBeenCalledWith('/quiz/esuken4/1/10')
  })

  it('navigates to top when back is clicked', () => {
    const { result } = renderHook(() => useRangeSelect())

    result.current.onNavigateToTop()

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})