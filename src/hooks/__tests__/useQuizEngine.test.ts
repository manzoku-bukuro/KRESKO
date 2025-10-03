import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useQuizEngine } from '../useQuizEngine'
import type { QuizQuestion, QuizEngineConfig } from '@/types'

// テスト用のサンプルデータ
const sampleQuestions: QuizQuestion[] = [
  { esperanto: 'hundo', japanese: '犬', extra: '動物' },
  { esperanto: 'kato', japanese: '猫' },
  { esperanto: 'birdo', japanese: '鳥' },
  { esperanto: 'fiŝo', japanese: '魚' },
  { esperanto: 'ĉevalo', japanese: '馬' },
]

describe('useQuizEngine', () => {
  beforeEach(() => {
    // Math.random をモックして予測可能な結果にする
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('初期状態', () => {
    it('デフォルト設定で正しい初期状態を返す', () => {
      const { result } = renderHook(() => useQuizEngine())

      expect(result.current.state.questions).toEqual([])
      expect(result.current.state.currentIndex).toBe(0)
      expect(result.current.state.finished).toBe(false)
      expect(result.current.state.quizMode).toBe('traditional')
      expect(result.current.state.showAnswer).toBe(false)
      expect(result.current.state.selectedAnswer).toBe(null)
      expect(result.current.state.showResult).toBe(false)
      expect(result.current.state.choices).toEqual([])
      expect(result.current.state.incorrectQuestions).toEqual([])
      expect(result.current.state.correctQuestions).toEqual([])
      expect(result.current.state.progress).toBe(0)
      expect(result.current.state.isLastQuestion).toBe(false)
    })

    it('カスタム設定で初期化できる', () => {
      const config: Partial<QuizEngineConfig> = {
        initialMode: 'multiple-choice',
        maxQuestions: 5,
        shuffleQuestions: false,
      }

      const { result } = renderHook(() => useQuizEngine(config))

      expect(result.current.state.quizMode).toBe('multiple-choice')
    })
  })

  describe('クイズ初期化', () => {
    it('問題を正しく初期化する', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      expect(result.current.state.questions).toHaveLength(5)
      expect(result.current.state.currentIndex).toBe(0)
      expect(result.current.state.finished).toBe(false)
      expect(result.current.state.progress).toBe(20) // (1/5) * 100
    })

    it('maxQuestions設定で問題数を制限する', () => {
      const config = { maxQuestions: 3 }
      const { result } = renderHook(() => useQuizEngine(config))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      expect(result.current.state.questions).toHaveLength(3)
    })

    it('shuffleQuestions=falseでシャッフルしない', () => {
      const config = { shuffleQuestions: false }
      const { result } = renderHook(() => useQuizEngine(config))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      // シャッフルしていないので最初の問題が同じ
      expect(result.current.state.questions[0]).toEqual(sampleQuestions[0])
    })
  })

  describe('モード切り替え', () => {
    it('クイズモードを変更できる', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.setQuizMode('multiple-choice')
      })

      expect(result.current.state.quizMode).toBe('multiple-choice')
      expect(result.current.state.showAnswer).toBe(false)
      expect(result.current.state.selectedAnswer).toBe(null)
      expect(result.current.state.showResult).toBe(false)
    })
  })

  describe('従来モード操作', () => {
    it('従来モードで答えを表示する', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      act(() => {
        result.current.actions.handleTraditionalClick()
      })

      expect(result.current.state.showAnswer).toBe(true)
    })

    it('従来モードで次の問題に進む', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      // 答えを表示
      act(() => {
        result.current.actions.handleTraditionalClick()
      })

      // 次の問題へ
      act(() => {
        result.current.actions.handleTraditionalClick()
      })

      expect(result.current.state.currentIndex).toBe(1)
      expect(result.current.state.showAnswer).toBe(false)
    })
  })

  describe('4択モード操作', () => {
    it('選択肢クリックで正解時の動作', () => {
      const onCorrectAnswer = vi.fn()
      const config = {
        initialMode: 'multiple-choice' as const,
        onCorrectAnswer
      }
      const { result } = renderHook(() => useQuizEngine(config))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      const correctAnswer = result.current.state.questions[0].japanese

      act(() => {
        result.current.actions.handleChoiceClick(correctAnswer)
      })

      expect(result.current.state.selectedAnswer).toBe(correctAnswer)
      expect(result.current.state.showResult).toBe(true)
      expect(result.current.state.showAnswer).toBe(true)
      expect(result.current.state.correctQuestions).toContain(0)
      expect(onCorrectAnswer).toHaveBeenCalledWith(
        result.current.state.questions[0],
        0
      )
    })

    it('選択肢クリックで不正解時の動作', () => {
      const onIncorrectAnswer = vi.fn()
      const config = {
        initialMode: 'multiple-choice' as const,
        onIncorrectAnswer
      }
      const { result } = renderHook(() => useQuizEngine(config))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      const wrongAnswer = '間違った答え'

      act(() => {
        result.current.actions.handleChoiceClick(wrongAnswer)
      })

      expect(result.current.state.selectedAnswer).toBe(wrongAnswer)
      expect(result.current.state.incorrectQuestions).toContain(0)
      expect(onIncorrectAnswer).toHaveBeenCalledWith(
        result.current.state.questions[0],
        0
      )
    })

    it('既に選択済みの場合は無効にする', () => {
      const { result } = renderHook(() => useQuizEngine({ initialMode: 'multiple-choice' }))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      // 最初の選択
      act(() => {
        result.current.actions.handleChoiceClick('最初の選択')
      })

      const firstSelection = result.current.state.selectedAnswer

      // 2回目の選択（無効になるはず）
      act(() => {
        result.current.actions.handleChoiceClick('2回目の選択')
      })

      expect(result.current.state.selectedAnswer).toBe(firstSelection)
    })
  })

  describe('進捗管理', () => {
    it('progress値を正しく計算する', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions.slice(0, 4)) // 4問
      })

      expect(result.current.state.progress).toBe(25) // (1/4) * 100

      act(() => {
        result.current.actions.nextQuestion()
      })

      expect(result.current.state.progress).toBe(50) // (2/4) * 100
    })

    it('最後の問題でisLastQuestionがtrueになる', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions.slice(0, 2)) // 2問
      })

      expect(result.current.state.isLastQuestion).toBe(false)

      act(() => {
        result.current.actions.nextQuestion()
      })

      expect(result.current.state.isLastQuestion).toBe(true)
    })

    it('最後の問題の後でfinishedがtrueになる', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions.slice(0, 2)) // 2問
      })

      // 2問目まで進む
      act(() => {
        result.current.actions.nextQuestion()
      })

      expect(result.current.state.finished).toBe(false)

      // 終了
      act(() => {
        result.current.actions.nextQuestion()
      })

      expect(result.current.state.finished).toBe(true)
    })
  })

  describe('手動マーキング', () => {
    it('手動で不正解にマークできる', () => {
      const onIncorrectAnswer = vi.fn()
      const { result } = renderHook(() => useQuizEngine({ onIncorrectAnswer }))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      act(() => {
        result.current.actions.markAsIncorrect()
      })

      expect(result.current.state.incorrectQuestions).toContain(0)
      expect(onIncorrectAnswer).toHaveBeenCalled()
    })

    it('手動で正解にマークできる', () => {
      const onCorrectAnswer = vi.fn()
      const { result } = renderHook(() => useQuizEngine({ onCorrectAnswer }))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      act(() => {
        result.current.actions.markAsCorrect()
      })

      expect(result.current.state.correctQuestions).toContain(0)
      expect(onCorrectAnswer).toHaveBeenCalled()
    })
  })

  describe('選択肢生成', () => {
    it('デフォルトの選択肢生成が動作する', () => {
      const { result } = renderHook(() => useQuizEngine({ initialMode: 'multiple-choice' }))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      expect(result.current.state.choices).toHaveLength(4)
      expect(result.current.state.choices).toContain(sampleQuestions[0].japanese)
    })

    it('カスタム選択肢生成が動作する', () => {
      const customGenerator = vi.fn().mockReturnValue(['選択肢1', '選択肢2', '選択肢3', '正解'])
      const config = {
        initialMode: 'multiple-choice' as const,
        choiceGeneration: {
          generateCustomChoices: customGenerator
        }
      }
      const { result } = renderHook(() => useQuizEngine(config))

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      expect(customGenerator).toHaveBeenCalled()
      expect(result.current.state.choices).toEqual(['選択肢1', '選択肢2', '選択肢3', '正解'])
    })
  })

  describe('リセット機能', () => {
    it('クイズをリセットできる', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz(sampleQuestions)
      })

      // 状態を変更
      act(() => {
        result.current.actions.nextQuestion()
        result.current.actions.markAsIncorrect()
      })

      // リセット
      act(() => {
        result.current.actions.resetQuiz()
      })

      expect(result.current.state.currentIndex).toBe(0)
      expect(result.current.state.finished).toBe(false)
      expect(result.current.state.showAnswer).toBe(false)
      expect(result.current.state.selectedAnswer).toBe(null)
      expect(result.current.state.showResult).toBe(false)
      expect(result.current.state.incorrectQuestions).toEqual([])
      expect(result.current.state.correctQuestions).toEqual([])
    })
  })

  describe('エッジケース', () => {
    it('空の問題配列でも動作する', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.initializeQuiz([])
      })

      expect(result.current.state.questions).toEqual([])
      expect(result.current.state.progress).toBe(0)
    })

    it('問題がない状態で選択肢生成しても安全', () => {
      const { result } = renderHook(() => useQuizEngine())

      act(() => {
        result.current.actions.generateChoices()
      })

      expect(result.current.state.choices).toEqual([])
    })
  })
})