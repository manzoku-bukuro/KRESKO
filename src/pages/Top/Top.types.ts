export interface TopViewProps {
  weakQuestionsCount: number
  isAuthenticated: boolean
  showAuthModal: boolean
  onNavigateToExam: () => void
  onNavigateToInterrogative: () => void
  onNavigateToNumberGame: () => void
  onNavigateToWeakQuestions: () => void
  onCloseAuthModal: () => void
  onAuthSuccess: () => void
}