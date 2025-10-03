import { useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizEngine } from '@/hooks'
import type { UnifiedQuizProps, QuizResults } from '../UnifiedQuiz.types'

export const useUnifiedQuiz = ({
  questions,
  metadata,
  engineConfig = {},
  onQuizComplete,
  onQuizExit,
  customActions = []
}: UnifiedQuizProps) => {
  const navigate = useNavigate()
  const initializedRef = useRef(false)

  // useQuizEngine with provided config
  const { state, actions } = useQuizEngine({
    initialMode: 'traditional',
    maxQuestions: 10,
    shuffleQuestions: true,
    enableIncorrectTracking: true,
    ...engineConfig
  })

  const {
    questions: activeQuestions,
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
    isLastQuestion
  } = state

  // Initialize quiz when questions are provided (once per mount)
  useEffect(() => {
    if (questions.length > 0 && !initializedRef.current) {
      actions.initializeQuiz(questions)
      initializedRef.current = true
    }
  }, [questions, actions])

  // Calculate results
  const results: QuizResults = useMemo(() => ({
    totalQuestions: activeQuestions.length,
    correctAnswers: correctQuestions.length,
    incorrectAnswers: incorrectQuestions.length,
    completedQuestions: activeQuestions,
    incorrectQuestions: incorrectQuestions.map(index => activeQuestions[index]).filter(Boolean)
  }), [activeQuestions, correctQuestions, incorrectQuestions])

  // Notify parent when quiz completes
  useEffect(() => {
    if (finished && onQuizComplete) {
      onQuizComplete(results)
    }
  }, [finished, results, onQuizComplete])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onQuizExit) {
      onQuizExit()
    } else if (metadata.backButtonPath) {
      navigate(metadata.backButtonPath)
    } else {
      navigate(-1)
    }
  }, [onQuizExit, metadata.backButtonPath, navigate])

  // Current question
  const currentQuestion = activeQuestions[currentIndex]

  // Memoize wordDisplay objects to prevent unnecessary re-renders
  const traditionalWordDisplay = useMemo(() => ({
    primary: currentQuestion?.esperanto || '',
    secondary: currentQuestion?.japanese || '',
    extra: currentQuestion?.extra
  }), [currentQuestion])

  const choiceWordDisplay = useMemo(() => ({
    extra: currentQuestion?.extra
  }), [currentQuestion])

  // Filter custom actions by condition
  const getFilteredActions = useCallback((condition: string) => {
    return customActions.filter(action =>
      !action.condition || action.condition === 'always' || action.condition === condition
    )
  }, [customActions])

  return {
    // State
    activeQuestions,
    currentIndex,
    finished,
    quizMode,
    showAnswer,
    selectedAnswer,
    showResult,
    choices,
    progress,
    isLastQuestion,
    currentQuestion,
    results,

    // Computed values
    traditionalWordDisplay,
    choiceWordDisplay,

    // Actions
    ...actions,
    handleBack,
    getFilteredActions
  }
}
