import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { UnifiedQuiz } from './UnifiedQuiz'
import type { UnifiedQuizProps, QuizQuestion } from './UnifiedQuiz.types'
import * as hooks from '../../hooks'

// Mock useQuizEngine hook
vi.mock('../../hooks', () => ({
  useQuizEngine: vi.fn()
}))

// Mock子コンポーネント
vi.mock('../QuizHeader', () => ({
  QuizHeader: ({ title }: any) => <div data-testid="quiz-header">{title}</div>
}))

vi.mock('../ChoiceButtons', () => ({
  ChoiceButtons: () => <div data-testid="choice-buttons">Choice Buttons</div>
}))

vi.mock('../AnswerResult', () => ({
  AnswerResult: ({ isVisible }: any) =>
    isVisible ? <div data-testid="answer-result">Answer Result</div> : null
}))

vi.mock('../WordList', () => ({
  WordList: () => <div data-testid="word-list">Word List</div>
}))

// テスト用データ
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

const renderWithRouter = (props: Partial<UnifiedQuizProps> = {}) => {
  return render(
    <BrowserRouter>
      <UnifiedQuiz {...defaultProps} {...props} />
    </BrowserRouter>
  )
}

describe('UnifiedQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // デフォルトのモック状態をセット
    vi.mocked(hooks.useQuizEngine).mockReturnValue({
      state: {
        questions: [],
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
      actions: {
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
    })
  })

  describe('基本的なレンダリング', () => {
    it('ローディング状態を表示する', () => {
      renderWithRouter({ loading: true })
      expect(screen.getByText('テストクイズ')).toBeInTheDocument()
      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    })

    it('カスタムローディングメッセージを表示する', () => {
      renderWithRouter({
        loading: true,
        loadingConfig: { message: 'データを取得中...', showSpinner: true }
      })
      expect(screen.getByText('データを取得中...')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('エラー状態を表示する', () => {
      renderWithRouter({
        error: 'データの読み込みに失敗しました',
        errorConfig: { message: 'データの読み込みに失敗しました', title: 'エラー発生' }
      })
      expect(screen.getByText(/エラー発生/)).toBeInTheDocument()
      expect(screen.getByText('データの読み込みに失敗しました')).toBeInTheDocument()
    })

    it('エラー時にアクションボタンを表示する', async () => {
      const onAction = vi.fn()
      renderWithRouter({
        error: 'エラー',
        errorConfig: {
          message: 'エラー',
          onAction,
          actionLabel: 'リトライ'
        }
      })

      const retryButton = screen.getByText('リトライ')
      await userEvent.click(retryButton)
      expect(onAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('クイズ完了状態', () => {
    it('完了画面を表示する', () => {
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
        actions: {
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
      })

      renderWithRouter()
      expect(screen.getByText('🎉 完了！')).toBeInTheDocument()
      expect(screen.getByText(/お疲れ様でした/)).toBeInTheDocument()
    })

    it('カスタム完了メッセージを表示する', () => {
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
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: {
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
      })

      renderWithRouter({
        completionConfig: {
          title: 'よくできました！',
          subtitle: 'すべて正解です'
        }
      })
      expect(screen.getByText('🎉 よくできました！')).toBeInTheDocument()
      expect(screen.getByText('すべて正解です')).toBeInTheDocument()
    })

    it('単語リストを表示する', () => {
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
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: {
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
      })

      renderWithRouter({
        completionConfig: {
          showWordList: true
        }
      })
      expect(screen.getByTestId('word-list')).toBeInTheDocument()
    })

    it('リスタートボタンが機能する', async () => {
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
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: {
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
      })

      const onRestart = vi.fn()
      renderWithRouter({
        completionConfig: {
          onRestart,
          restartButtonText: '🔄 もう一度'
        }
      })

      const restartButton = screen.getByText('🔄 もう一度')
      await userEvent.click(restartButton)
      expect(onRestart).toHaveBeenCalledTimes(1)
    })
  })

  describe('クイズ進行中', () => {
    it('通常モードでクイズヘッダーと問題を表示する', () => {
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
        actions: {
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
      })

      renderWithRouter()
      expect(screen.getByTestId('quiz-header')).toBeInTheDocument()
      expect(screen.getByText('hundo')).toBeInTheDocument()
      expect(screen.getByText('👁️ 回答を表示')).toBeInTheDocument()
    })

    it('回答表示ボタンをクリックすると回答が表示される', async () => {
      const handleTraditionalClick = vi.fn()
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
        actions: {
          initializeQuiz: vi.fn(),
          resetQuiz: vi.fn(),
          setQuizMode: vi.fn(),
          handleChoiceClick: vi.fn(),
          handleTraditionalClick,
          nextQuestion: vi.fn(),
          generateChoices: vi.fn(),
          markAsIncorrect: vi.fn(),
          markAsCorrect: vi.fn()
        }
      })

      renderWithRouter()
      const showAnswerButton = screen.getByText('👁️ 回答を表示')
      await userEvent.click(showAnswerButton)
      expect(handleTraditionalClick).toHaveBeenCalledTimes(1)
    })

    it('選択式モードで選択肢を表示する', () => {
      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: mockQuestions,
          currentIndex: 0,
          finished: false,
          quizMode: 'multiple-choice',
          showAnswer: false,
          selectedAnswer: null,
          showResult: false,
          choices: ['犬', '猫', '鳥', '魚'],
          incorrectQuestions: [],
          correctQuestions: [],
          progress: 0,
          isLastQuestion: false
        },
        actions: {
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
      })

      renderWithRouter()
      expect(screen.getByTestId('choice-buttons')).toBeInTheDocument()
    })

    it('最後の問題で完了ボタンを表示する', () => {
      vi.mocked(hooks.useQuizEngine).mockReturnValue({
        state: {
          questions: mockQuestions,
          currentIndex: 2,
          finished: false,
          quizMode: 'traditional',
          showAnswer: true,
          selectedAnswer: null,
          showResult: false,
          choices: [],
          incorrectQuestions: [],
          correctQuestions: [0, 1],
          progress: 100,
          isLastQuestion: true
        },
        actions: {
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
      })

      renderWithRouter()
      expect(screen.getByText('🎉 完了！')).toBeInTheDocument()
    })
  })

  describe('カスタムアクション', () => {
    it('カスタムアクションを表示する', () => {
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
        actions: {
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
      })

      const customAction = {
        id: 'test-action',
        label: 'テストアクション',
        icon: '🔧',
        onClick: vi.fn(),
        condition: 'always' as const,
        position: 'bottom' as const
      }

      renderWithRouter({
        customActions: [customAction]
      })

      expect(screen.getAllByText('🔧 テストアクション').length).toBeGreaterThan(0)
    })

    it('カスタムアクションのクリックが機能する', async () => {
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
        actions: {
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
      })

      const onClick = vi.fn()
      const customAction = {
        id: 'test-action',
        label: 'テストアクション',
        onClick,
        condition: 'always' as const,
        position: 'bottom' as const
      }

      renderWithRouter({
        customActions: [customAction]
      })

      const actionButtons = screen.getAllByText('テストアクション')
      await userEvent.click(actionButtons[0])
      expect(onClick).toHaveBeenCalledWith(mockQuestions[0], 0)
    })
  })

  describe('イベントハンドラ', () => {
    it('クイズ完了時にonQuizCompleteを呼び出す', async () => {
      const onQuizComplete = vi.fn()

      const { rerender } = render(
        <BrowserRouter>
          <UnifiedQuiz {...defaultProps} onQuizComplete={onQuizComplete} />
        </BrowserRouter>
      )

      // クイズを完了状態に変更
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
          incorrectQuestions: [],
          correctQuestions: [0, 1, 2],
          progress: 100,
          isLastQuestion: false
        },
        actions: {
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
      })

      rerender(
        <BrowserRouter>
          <UnifiedQuiz {...defaultProps} onQuizComplete={onQuizComplete} />
        </BrowserRouter>
      )

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

    it('onQuizExitが呼ばれる', async () => {
      const onQuizExit = vi.fn()
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
        actions: {
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
      })

      renderWithRouter({ onQuizExit })
      const backButton = screen.getByText('← 戻る')
      await userEvent.click(backButton)
      expect(onQuizExit).toHaveBeenCalledTimes(1)
    })
  })
})