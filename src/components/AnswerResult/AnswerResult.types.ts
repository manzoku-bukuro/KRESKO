import type { ResultType, WordDisplay } from '../../types'

// Re-export for convenience
export type { ResultType, WordDisplay }

export interface AnswerResultProps {
  // 表示モード
  variant: 'traditional' | 'choice' | 'game'

  // 結果情報
  resultType?: ResultType
  isVisible: boolean

  // 表示内容
  wordDisplay?: WordDisplay
  message?: string

  // アクション
  onNext?: () => void
  nextButtonText?: string

  // スタイル
  className?: string
}

export interface AnswerResultState {
  isAnimating: boolean
}

export interface AnswerResultActions {
  handleNext: () => void
}
