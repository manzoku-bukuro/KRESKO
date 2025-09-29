export interface ChoiceButtonsProps {
  choices: string[]
  selectedAnswer?: string | null
  correctAnswer?: string
  showResult: boolean
  onChoiceClick: (choice: string) => void
  instruction?: string
  loadingMessage?: string
  className?: string
}

export interface ChoiceButtonsState {
  // 将来的に展開可能性のため予約
}

export interface ChoiceButtonsActions {
  handleChoiceClick: (choice: string) => void
}