import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type {
  QuizMode,
  QuizQuestion,
  QuizEngineConfig,
  QuizEngineState,
  QuizEngineActions,
  UseQuizEngineReturn,
} from '../types'

const DEFAULT_CONFIG: QuizEngineConfig = {
  initialMode: 'traditional',
  maxQuestions: 10,
  shuffleQuestions: true,
  choiceGeneration: {
    choiceCount: 4,
  },
  enableIncorrectTracking: true,
}

export const useQuizEngine = (config: Partial<QuizEngineConfig> = {}): UseQuizEngineReturn => {
  const configRef = useRef({ ...DEFAULT_CONFIG, ...config })

  // 設定が変更された場合のみ更新
  useEffect(() => {
    configRef.current = { ...DEFAULT_CONFIG, ...config }
  }, [config])

  // 基本状態
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  // 表示状態
  const [quizMode, setQuizMode] = useState<QuizMode>(configRef.current.initialMode!)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [choices, setChoices] = useState<string[]>([])

  // 結果追跡
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([])
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([])

  // 計算されたプロパティ
  const progress = useMemo(() => {
    if (questions.length === 0) return 0
    return ((currentIndex + 1) / questions.length) * 100
  }, [currentIndex, questions.length])

  const isLastQuestion = useMemo(() => {
    return currentIndex === questions.length - 1
  }, [currentIndex, questions.length])

  const currentQuestion = useMemo(() => {
    return questions[currentIndex] || null
  }, [questions, currentIndex])

  // 選択肢生成のデフォルト実装
  const defaultGenerateChoices = useCallback((
    current: QuizQuestion,
    allQuestions: QuizQuestion[]
  ): string[] => {
    const { choiceCount = 4 } = configRef.current.choiceGeneration!

    // 他の問題から間違い選択肢を生成
    const otherQuestions = allQuestions.filter(q => q.japanese !== current.japanese)
    let wrongChoices: string[] = []

    if (otherQuestions.length >= choiceCount - 1) {
      wrongChoices = otherQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, choiceCount - 1)
        .map(q => q.japanese)
    } else {
      // 足りない場合はダミー選択肢
      wrongChoices = otherQuestions.map(q => q.japanese)
      const dummyChoices = ['約束', '希望', '勇気', '友情', '真実', '平和', '美しさ', '知識', '感謝', '愛情']

      while (wrongChoices.length < choiceCount - 1) {
        const dummyChoice = dummyChoices[Math.floor(Math.random() * dummyChoices.length)]
        if (!wrongChoices.includes(dummyChoice) && dummyChoice !== current.japanese) {
          wrongChoices.push(dummyChoice)
        }
      }
    }

    // 正解と間違いをシャッフル
    return [current.japanese, ...wrongChoices].sort(() => Math.random() - 0.5)
  }, [])

  // アクション: 選択肢生成
  const generateChoices = useCallback(() => {
    if (!currentQuestion || questions.length === 0) return

    let newChoices: string[]

    const config = configRef.current
    if (config.choiceGeneration?.generateCustomChoices) {
      newChoices = config.choiceGeneration.generateCustomChoices(currentQuestion, questions)
    } else if (config.choiceGeneration?.generateFromPool) {
      const pool = config.choiceGeneration.generateFromPool(questions)
      const otherChoices = pool
        .filter(choice => choice !== currentQuestion.japanese)
        .sort(() => Math.random() - 0.5)
        .slice(0, (config.choiceGeneration.choiceCount || 4) - 1)
      newChoices = [currentQuestion.japanese, ...otherChoices]
        .sort(() => Math.random() - 0.5)
    } else {
      newChoices = defaultGenerateChoices(currentQuestion, questions)
    }

    setChoices(newChoices)
  }, [currentQuestion, questions, defaultGenerateChoices])

  // アクション: クイズ初期化
  const initializeQuiz = useCallback((
    newQuestions: QuizQuestion[],
    runtimeConfig?: Partial<QuizEngineConfig>
  ) => {
    if (runtimeConfig) {
      Object.assign(configRef.current, runtimeConfig)
    }

    let processedQuestions = [...newQuestions]
    const config = configRef.current

    if (config.shuffleQuestions) {
      processedQuestions = processedQuestions.sort(() => Math.random() - 0.5)
    }

    if (config.maxQuestions && processedQuestions.length > config.maxQuestions) {
      processedQuestions = processedQuestions.slice(0, config.maxQuestions)
    }

    setQuestions(processedQuestions)
    setCurrentIndex(0)
    setFinished(false)
    setShowAnswer(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setChoices([])
    setIncorrectQuestions([])
    setCorrectQuestions([])
  }, [])

  // アクション: リセット
  const resetQuiz = useCallback(() => {
    setCurrentIndex(0)
    setFinished(false)
    setShowAnswer(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setChoices([])
    setIncorrectQuestions([])
    setCorrectQuestions([])
  }, [])

  // アクション: モード変更
  const handleModeChange = useCallback((mode: QuizMode) => {
    setQuizMode(mode)
    setShowAnswer(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setChoices([])
  }, [])

  // アクション: 選択肢クリック（4択モード）
  const handleChoiceClick = useCallback((choice: string) => {
    if (selectedAnswer || !currentQuestion) return

    setSelectedAnswer(choice)
    setShowResult(true)
    setShowAnswer(true)

    const isCorrect = choice === currentQuestion.japanese
    const config = configRef.current

    // 結果の記録
    if (isCorrect) {
      setCorrectQuestions(prev => [...prev, currentIndex])
      config.onCorrectAnswer?.(currentQuestion, currentIndex)
    } else {
      if (config.enableIncorrectTracking) {
        setIncorrectQuestions(prev => [...prev, currentIndex])
      }
      config.onIncorrectAnswer?.(currentQuestion, currentIndex)
    }
  }, [selectedAnswer, currentQuestion, currentIndex])

  // アクション: 次の問題へ
  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
      setSelectedAnswer(null)
      setShowResult(false)
      setChoices([])
    } else {
      setFinished(true)
    }
  }, [currentIndex, questions.length])

  // アクション: 従来モードクリック
  const handleTraditionalClick = useCallback(() => {
    if (!showAnswer) {
      setShowAnswer(true)
    } else {
      nextQuestion()
    }
  }, [showAnswer, nextQuestion])

  // アクション: 手動で不正解マーク
  const markAsIncorrect = useCallback(() => {
    const config = configRef.current
    if (config.enableIncorrectTracking && !incorrectQuestions.includes(currentIndex)) {
      setIncorrectQuestions(prev => [...prev, currentIndex])
      if (currentQuestion) {
        config.onIncorrectAnswer?.(currentQuestion, currentIndex)
      }
    }
  }, [currentIndex, incorrectQuestions, currentQuestion])

  // アクション: 手動で正解マーク
  const markAsCorrect = useCallback(() => {
    if (!correctQuestions.includes(currentIndex)) {
      setCorrectQuestions(prev => [...prev, currentIndex])
      if (currentQuestion) {
        const config = configRef.current
        config.onCorrectAnswer?.(currentQuestion, currentIndex)
      }
    }
  }, [currentIndex, correctQuestions, currentQuestion])

  // 自動選択肢生成（multiple-choiceモード時）
  useEffect(() => {
    if (quizMode === 'multiple-choice' && currentQuestion && questions.length > 0) {
      let newChoices: string[]
      const config = configRef.current

      if (config.choiceGeneration?.generateCustomChoices) {
        newChoices = config.choiceGeneration.generateCustomChoices(currentQuestion, questions)
      } else if (config.choiceGeneration?.generateFromPool) {
        const pool = config.choiceGeneration.generateFromPool(questions)
        const otherChoices = pool
          .filter(choice => choice !== currentQuestion.japanese)
          .sort(() => Math.random() - 0.5)
          .slice(0, (config.choiceGeneration.choiceCount || 4) - 1)
        newChoices = [currentQuestion.japanese, ...otherChoices]
          .sort(() => Math.random() - 0.5)
      } else {
        newChoices = defaultGenerateChoices(currentQuestion, questions)
      }

      setChoices(newChoices)
    }
  }, [currentIndex, quizMode, currentQuestion, questions, defaultGenerateChoices])

  // 状態オブジェクト
  const state: QuizEngineState = {
    questions,
    currentIndex,
    finished,
    quizMode,
    showAnswer,
    selectedAnswer,
    showResult,
    choices,
    incorrectQuestions,
    correctQuestions,
    progress,
    isLastQuestion,
  }

  // アクションオブジェクト
  const actions: QuizEngineActions = useMemo(() => ({
    initializeQuiz,
    resetQuiz,
    setQuizMode: handleModeChange,
    handleChoiceClick,
    handleTraditionalClick,
    nextQuestion,
    generateChoices,
    markAsIncorrect,
    markAsCorrect,
  }), [
    initializeQuiz,
    resetQuiz,
    handleModeChange,
    handleChoiceClick,
    handleTraditionalClick,
    nextQuestion,
    generateChoices,
    markAsIncorrect,
    markAsCorrect,
  ])

  return { state, actions }
}