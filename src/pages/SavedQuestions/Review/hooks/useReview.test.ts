import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useReview } from './useReview'
import * as firestore from '../../../../utils/firestore'
import type { QuizQuestion } from '../../../../hooks'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-user' } }),
}))

vi.mock('../../../../utils/firestore', () => ({
  getWeakQuestions: vi.fn(),
  removeWeakQuestion: vi.fn(),
}))

describe('useReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with loading state', () => {
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue([])

    const { result } = renderHook(() => useReview())

    expect(result.current.loading).toBe(true)
    expect(result.current.quizQuestions).toEqual([])
    expect(result.current.allWeakQuestions).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('fetches weak questions and converts to quiz questions', async () => {
    const mockQuestions = [
      {
        esperanto: 'kato',
        japanese: '猫',
        extra: '動物',
        addedAt: new Date(),
        incorrectCount: 1,
      },
      {
        esperanto: 'hundo',
        japanese: '犬',
        addedAt: new Date(),
        incorrectCount: 2,
      },
    ]
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useReview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.allWeakQuestions).toEqual(mockQuestions)
    expect(result.current.quizQuestions.length).toBeGreaterThan(0)
    expect(result.current.quizQuestions.length).toBeLessThanOrEqual(10)
    expect(firestore.getWeakQuestions).toHaveBeenCalledTimes(1)
  })

  it('limits quiz questions to maximum 10', async () => {
    const mockQuestions = Array.from({ length: 15 }, (_, i) => ({
      esperanto: `word${i}`,
      japanese: `意味${i}`,
      addedAt: new Date(),
      incorrectCount: 1,
    }))
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useReview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.quizQuestions).toHaveLength(10)
  })

  it('removes a weak question when understood', async () => {
    const mockQuestions = [
      {
        esperanto: 'kato',
        japanese: '猫',
        addedAt: new Date(),
        incorrectCount: 1,
      },
    ]
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue(mockQuestions)
    vi.mocked(firestore.removeWeakQuestion).mockResolvedValue()

    const { result } = renderHook(() => useReview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const currentQuestion: QuizQuestion = {
      esperanto: 'kato',
      japanese: '猫',
    }

    await act(async () => {
      await result.current.onUnderstood(currentQuestion)
    })

    expect(firestore.removeWeakQuestion).toHaveBeenCalledWith('kato')
  })

  it('sets error when fetch fails', async () => {
    vi.mocked(firestore.getWeakQuestions).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useReview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('苦手問題の取得に失敗しました')
  })

  it('provides navigation handlers', () => {
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue([])

    const { result } = renderHook(() => useReview())

    expect(typeof result.current.onNavigateToTop).toBe('function')
    expect(typeof result.current.onNavigateToList).toBe('function')
  })
})