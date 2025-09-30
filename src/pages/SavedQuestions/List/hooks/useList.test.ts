import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useList } from './useList'
import * as firestore from '../../../../utils/firestore'

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

describe('useList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with loading state', () => {
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue([])

    const { result } = renderHook(() => useList())

    expect(result.current.loading).toBe(true)
    expect(result.current.weakQuestions).toEqual([])
  })

  it('fetches weak questions on mount', async () => {
    const mockQuestions = [
      {
        esperanto: 'kato',
        japanese: '猫',
        addedAt: new Date(),
        incorrectCount: 1,
      },
    ]
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue(mockQuestions)

    const { result } = renderHook(() => useList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.weakQuestions).toEqual(mockQuestions)
    expect(firestore.getWeakQuestions).toHaveBeenCalledTimes(1)
  })

  it('removes a question from the list', async () => {
    const mockQuestions = [
      {
        esperanto: 'kato',
        japanese: '猫',
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
    vi.mocked(firestore.removeWeakQuestion).mockResolvedValue()

    const { result } = renderHook(() => useList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.weakQuestions).toHaveLength(2)

    await act(async () => {
      await result.current.onRemoveQuestion('kato')
    })

    expect(firestore.removeWeakQuestion).toHaveBeenCalledWith('kato')
    expect(result.current.weakQuestions).toHaveLength(1)
    expect(result.current.weakQuestions[0].esperanto).toBe('hundo')
  })

  it('provides navigation handlers', () => {
    vi.mocked(firestore.getWeakQuestions).mockResolvedValue([])

    const { result } = renderHook(() => useList())

    expect(typeof result.current.onNavigateToReview).toBe('function')
    expect(typeof result.current.onNavigateToTop).toBe('function')
  })
})