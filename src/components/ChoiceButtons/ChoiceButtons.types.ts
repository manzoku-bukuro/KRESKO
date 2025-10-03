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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface ChoiceButtonsState {}

export interface ChoiceButtonsActions {
  handleChoiceClick: (choice: string) => void
}