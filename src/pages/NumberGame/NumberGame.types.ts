export interface Card {
  value: number
  word: string
}

export interface GameResult {
  show: boolean
  correct: boolean
  message: string
}

export interface NumberGameViewProps {
  targetNumber: number
  selectedCards: Card[]
  cards: Card[]
  result: GameResult
  onSelectCard: (value: number, word: string) => void
  onRemoveCard: (index: number) => void
  onClearSelection: () => void
  onCheckAnswer: () => void
  onNewGame: () => void
  onNavigateToTop: () => void
}