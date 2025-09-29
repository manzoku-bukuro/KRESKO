export interface QuizHeaderProps {
  title: string
  currentQuestion: number
  totalQuestions: number
  subtitle?: string
  showModeToggle?: boolean
  modeToggleProps?: {
    currentMode: 'traditional' | 'multiple-choice'
    onModeChange: (mode: 'traditional' | 'multiple-choice') => void
    traditionalLabel?: string
    multipleChoiceLabel?: string
  }
  className?: string
}

export interface QuizHeaderState {
  // 将来的に展開可能性のため予約
}

export interface QuizHeaderActions {
  // 将来的に展開可能性のため予約
}