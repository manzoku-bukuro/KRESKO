import type { User } from 'firebase/auth'
import type { WeakQuestion } from '../../../utils/firestore'

export interface ListViewProps {
  user: User | null
  loading: boolean
  weakQuestions: WeakQuestion[]
  onRemoveQuestion: (esperanto: string) => Promise<void>
  onNavigateToReview: () => void
  onNavigateToTop: () => void
}