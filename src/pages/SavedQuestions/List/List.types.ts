import type { WeakQuestion } from '../../../utils/firestore'

export interface ListViewProps {
  user: any
  loading: boolean
  weakQuestions: WeakQuestion[]
  onRemoveQuestion: (esperanto: string) => Promise<void>
  onNavigateToReview: () => void
  onNavigateToTop: () => void
}