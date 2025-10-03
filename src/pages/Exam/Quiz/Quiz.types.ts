import type { QuizQuestion } from '../../../hooks'

export interface Word {
  esperanto: string
  japanese: string
  extra?: string
}

export interface QuizViewProps {
  dataError: string | null
  quizQuestions: QuizQuestion[]
  categoryEmoji: string
  categoryName: string
  rangeStart: string
  rangeSize: string
  category: string
  wordsLength: number
  isAuthenticated: boolean
  onMarkAsWeak: (question: QuizQuestion) => Promise<void>
  onNextRange: () => void
  onNavigateToRange: () => void
  onNavigateToTop: () => void
  onGenerateCustomChoices: (
    currentQuestion: QuizQuestion,
    allQuestions: QuizQuestion[]
  ) => string[]
}