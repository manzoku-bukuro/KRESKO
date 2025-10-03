import type { QuizMode } from '@/types'

export interface ModeToggleProps {
  currentMode: QuizMode
  onModeChange: (mode: QuizMode) => void
  traditionalLabel?: string
  multipleChoiceLabel?: string
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface ModeToggleState {}

export interface ModeToggleActions {
  handleTraditionalClick: () => void
  handleMultipleChoiceClick: () => void
}
