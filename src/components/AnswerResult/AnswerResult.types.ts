export type ResultType = 'correct' | 'wrong' | 'neutral'

export interface WordDisplay {
  primary?: string     // エスペラント語または質問文
  secondary?: string   // 日本語意味または答え
  extra?: string      // 追加情報・解説
}

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