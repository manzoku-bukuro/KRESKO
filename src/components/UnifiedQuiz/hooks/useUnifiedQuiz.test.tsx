import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useUnifiedQuiz } from './useUnifiedQuiz'
import * as hooks from '@/hooks'
import type { UnifiedQuizProps } from '../UnifiedQuiz.types'
import type { QuizQuestion } from '@/types'

// Mock dependencies
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/hooks', () => ({
  useQuizEngine: vi.fn()
}))

// Test data
const mockQuestions: QuizQuestion[] = [
  { esperanto: 'hundo', japanese: '犬' },
  { esperanto: 'kato', japanese: '猫' },
  { esperanto: 'birdo', japanese: '鳥' }
]

const mockMetadata = {
  title: 'テストクイズ',
  subtitle: '単語クイズ',
  backButtonText: '← 戻る',
  backButtonPath: '/test'
}

const defaultProps: UnifiedQuizProps = {
  questions: mockQuestions,
  metadata: mockMetadata
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('useUnifiedQuiz', () => {
  const mockActions = {
    initializeQuiz: vi.fn(),
    resetQuiz: vi.fn(),
    setQuizMode: vi.fn(),
    handleChoiceClick: vi.fn(),
    handleTraditionalClick: vi.fn(),
    nextQuestion: vi.fn(),
    generateChoices: vi.fn(),
    markAsIncorrect: vi.fn(),
    markAsCorrect: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(hooks.useQuizEngine).mockReturnValue({
      state: {
        questions: mockQuestions,
        currentIndex: 0,
        finished: false,
        quizMode: 'traditional',
        showAnswer: false,
        selectedAnswer: null,
        showResult: false,
        choices: [],
        incorrectQuestions: [],
        correctQuestions: [],
        progress: 0,
        isLastQuestion: false
      },
      actions: mockActions
    })
  })

  describe('初期化', () => {
    it('questionsが提供されたときにinitializeQuizを呼び出す', () => {
      renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(mockActions.initializeQuiz).toHaveBeenCalledWith(mockQuestions)
      expect(mockActions.initializeQuiz).toHaveBeenCalledTimes(1)
    })

    it('空のquestionsでは初期化しない', () => {
      renderHook(() => useUnifiedQuiz({ ...defaultProps, questions: [] }), { wrapper })

      expect(mockActions.initializeQuiz).not.toHaveBeenCalled()
    })

    it('engineConfigをuseQuizEngineに渡す', () => {
      const engineConfig = {
        initialMode: 'multiple-choice' as const,
        maxQuestions: 20
      }

      renderHook(() => useUnifiedQuiz({ ...defaultProps, engineConfig }), { wrapper })

      expect(hooks.useQuizEngine).toHaveBeenCalledWith(
        expect.objectContaining(engineConfig)
      )
    })
  })

  describe('状態管理', () => {
    it('useQuizEngineからの状態を正しく返す', () => {
      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(result.current.activeQuestions).toEqual(mockQuestions)
      expect(result.current.currentIndex).toBe(0)
      expect(result.current.finished).toBe(false)
      expect(result.current.quizMode).toBe('traditional')
    })

    it('currentQuestionを正しく計算する', () => {
      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(result.current.currentQuestion).toEqual(mockQuestions[0])
    })

    it('resultsを正しく計算する', () => {
      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: mockQuestions,
          currentIndex: 0,
          finished: true,
          quizMode: 'traditional',
          showAnswer: false,
          selectedAnswer: null,
          showResult: false,
          choices: [],
          incorrectQuestions: [0],
          correctQuestions: [1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: mockActions
      })

      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(result.current.results).toEqual({
        totalQuestions: 3,
        correctAnswers: 2,
        incorrectAnswers: 1,
        completedQuestions: mockQuestions,
        incorrectQuestions: [mockQuestions[0]]
      })
    })
  })

  describe('メモ化された値', () => {
    it('traditionalWordDisplayを正しく計算する', () => {
      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(result.current.traditionalWordDisplay).toEqual({
        primary: 'hundo',
        secondary: '犬',
        extra: undefined
      })
    })

    it('choiceWordDisplayを正しく計算する', () => {
      const questionWithExtra: QuizQuestion = {
        esperanto: 'hundo',
        japanese: '犬',
        extra: '動物'
      }

      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: [questionWithExtra],
          currentIndex: 0,
          finished: false,
          quizMode: 'traditional',
          showAnswer: false,
          selectedAnswer: null,
          showResult: false,
          choices: [],
          incorrectQuestions: [],
          correctQuestions: [],
          progress: 0,
          isLastQuestion: false
        },
        actions: mockActions
      })

      const { result } = renderHook(
        () => useUnifiedQuiz({ ...defaultProps, questions: [questionWithExtra] }),
        { wrapper }
      )

      expect(result.current.choiceWordDisplay).toEqual({
        extra: '動物'
      })
    })
  })

  describe('ナビゲーション', () => {
    it('handleBackがonQuizExitを呼び出す', () => {
      const onQuizExit = vi.fn()
      const { result } = renderHook(
        () => useUnifiedQuiz({ ...defaultProps, onQuizExit }),
        { wrapper }
      )

      act(() => {
        result.current.handleBack()
      })

      expect(onQuizExit).toHaveBeenCalledTimes(1)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('handleBackがbackButtonPathにナビゲートする', () => {
      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      act(() => {
        result.current.handleBack()
      })

      expect(mockNavigate).toHaveBeenCalledWith('/test')
    })

    it('handleBackがhistory.backを呼び出す（パスがない場合）', () => {
      const propsWithoutPath = {
        ...defaultProps,
        metadata: { ...mockMetadata, backButtonPath: undefined }
      }

      const { result } = renderHook(() => useUnifiedQuiz(propsWithoutPath), { wrapper })

      act(() => {
        result.current.handleBack()
      })

      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })
  })

  describe('カスタムアクション', () => {
    it('getFilteredActionsが条件に基づいてフィルタリングする', () => {
      const customActions = [
        { id: '1', label: 'Always', onClick: vi.fn(), condition: 'always' as const },
        { id: '2', label: 'Bottom', onClick: vi.fn(), condition: 'bottom' as const },
        { id: '3', label: 'Traditional', onClick: vi.fn(), condition: 'traditional-only' as const }
      ]

      const { result } = renderHook(
        () => useUnifiedQuiz({ ...defaultProps, customActions }),
        { wrapper }
      )

      const alwaysActions = result.current.getFilteredActions('always')
      expect(alwaysActions).toHaveLength(1)
      expect(alwaysActions[0].id).toBe('1')

      const bottomActions = result.current.getFilteredActions('bottom')
      expect(bottomActions).toHaveLength(1)
      expect(bottomActions[0].id).toBe('2')
    })

    it('条件なしのアクションは常に表示される', () => {
      const customActions = [
        { id: '1', label: 'No condition', onClick: vi.fn() }
      ]

      const { result } = renderHook(
        () => useUnifiedQuiz({ ...defaultProps, customActions }),
        { wrapper }
      )

      const actions = result.current.getFilteredActions('bottom')
      expect(actions).toHaveLength(1)
    })
  })

  describe('クイズ完了コールバック', () => {
    it('finishedになったときonQuizCompleteを呼び出す', async () => {
      const onQuizComplete = vi.fn()

      const { rerender } = renderHook(
        () => useUnifiedQuiz({ ...defaultProps, onQuizComplete }),
        { wrapper }
      )

      // クイズを完了状態に変更
      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: mockQuestions,
          currentIndex: 2,
          finished: true,
          quizMode: 'traditional',
          showAnswer: false,
          selectedAnswer: null,
          showResult: false,
          choices: [],
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: mockActions
      })

      rerender()

      await waitFor(() => {
        expect(onQuizComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            totalQuestions: 3,
            correctAnswers: 3,
            incorrectAnswers: 0
          })
        )
      })
    })

    it('onQuizCompleteがなければエラーにならない', () => {
      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: mockQuestions,
          currentIndex: 2,
          finished: true,
          quizMode: 'traditional',
          showAnswer: false,
          selectedAnswer: null,
          showResult: false,
          choices: [],
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: mockActions
      })

      expect(() => {
        renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })
      }).not.toThrow()
    })
  })

  describe('アクションの転送', () => {
    it('useQuizEngineのactionsを全て返す', () => {
      const { result } = renderHook(() => useUnifiedQuiz(defaultProps), { wrapper })

      expect(result.current.setQuizMode).toBe(mockActions.setQuizMode)
      expect(result.current.handleChoiceClick).toBe(mockActions.handleChoiceClick)
      expect(result.current.handleTraditionalClick).toBe(mockActions.handleTraditionalClick)
      expect(result.current.nextQuestion).toBe(mockActions.nextQuestion)
    })
  })
})
