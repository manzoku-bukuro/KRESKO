export type QuizMode = 'traditional' | 'multiple-choice'

export interface ModeToggleProps {
  currentMode: QuizMode
  onModeChange: (mode: QuizMode) => void
  traditionalLabel?: string
  multipleChoiceLabel?: string
  className?: string
}

export interface ModeToggleState {
  // 将来的に展開可能性のため予約
}

export interface ModeToggleActions {
  handleTraditionalClick: () => void
  handleMultipleChoiceClick: () => void
}