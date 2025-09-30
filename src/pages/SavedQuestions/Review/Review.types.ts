import type { WeakQuestion } from '../../../utils/firestore'
import type { QuizQuestion } from '../../../hooks'

export interface ReviewViewProps {
  user: any
  loading: boolean
  error: string | null
  allWeakQuestions: WeakQuestion[]
  quizQuestions: QuizQuestion[]
  onUnderstood: (currentQuestion: QuizQuestion) => Promise<void>
  onNavigateToTop: () => void
  onNavigateToList: () => void
}