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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface QuizHeaderState {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface QuizHeaderActions {}