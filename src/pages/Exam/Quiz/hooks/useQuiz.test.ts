import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useQuiz } from './useQuiz'
import * as firestore from '../../../../utils/firestore'

// Mock dependencies
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useParams: () => ({ category: 'esuken4', rangeStart: '1', rangeSize: '10' }),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-user' } }),
}))

vi.mock('../../../../utils/firestore', () => ({
  saveWeakQuestion: vi.fn(),
}))

describe('useQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct values', () => {
    const { result } = renderHook(() => useQuiz())

    expect(result.current.category).toBe('esuken4')
    expect(result.current.rangeStart).toBe('1')
    expect(result.current.rangeSize).toBe('10')
    expect(result.current.dataError).toBeNull()
  })

  it('prepares quiz questions from word data', () => {
    const { result } = renderHook(() => useQuiz())

    expect(result.current.quizQuestions.length).toBeGreaterThan(0)
    expect(result.current.quizQuestions.length).toBeLessThanOrEqual(10)
    expect(result.current.quizQuestions[0]).toHaveProperty('esperanto')
    expect(result.current.quizQuestions[0]).toHaveProperty('japanese')
  })

  it('returns category emoji and name', () => {
    const { result } = renderHook(() => useQuiz())

    expect(result.current.categoryEmoji).toBe('🏆')
    expect(result.current.categoryName).toBe('エス検4級')
  })

  it('saves weak question when user is authenticated', async () => {
    vi.mocked(firestore.saveWeakQuestion).mockResolvedValue()

    const { result } = renderHook(() => useQuiz())

    const question = {
      esperanto: 'kato',
      japanese: '猫',
    }

    await result.current.markAsWeak(question)

    expect(firestore.saveWeakQuestion).toHaveBeenCalledWith({
      esperanto: 'kato',
      japanese: '猫',
      extra: undefined,
    })
  })

  it('generates custom choices for multiple choice mode', () => {
    const { result } = renderHook(() => useQuiz())

    const question = {
      esperanto: 'kato',
      japanese: '猫',
    }

    const choices = result.current.generateCustomChoices(question)

    expect(choices).toHaveLength(4)
    expect(choices).toContain('猫')
  })

  it('provides navigation handlers', () => {
    const { result } = renderHook(() => useQuiz())

    expect(typeof result.current.handleNextRange).toBe('function')
    expect(typeof result.current.handleNavigateToRange).toBe('function')
    expect(typeof result.current.handleNavigateToTop).toBe('function')
  })

  it('navigates to next range when next is clicked', () => {
    const { result } = renderHook(() => useQuiz())

    result.current.handleNextRange()

    expect(mockNavigate).toHaveBeenCalledWith('/quiz/esuken4/11/10')
  })

  it('navigates to range select when range button is clicked', () => {
    const { result } = renderHook(() => useQuiz())

    result.current.handleNavigateToRange()

    expect(mockNavigate).toHaveBeenCalledWith('/range/esuken4')
  })
})