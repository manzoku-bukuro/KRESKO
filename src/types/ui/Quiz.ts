import type { QuizQuestion } from '../domain'

/**
 * クイズのメタデータ
 */
export interface QuizMetadata {
  title: string
  subtitle: string
  emoji?: string
  backButtonText?: string
  backButtonPath?: string
}

/**
 * 完了アクション
 */
export interface CompletionAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  icon?: string
}

/**
 * 完了画面の設定
 */
export interface CompletionConfig {
  title?: string
  subtitle?: string
  showWordList?: boolean
  wordListTitle?: string
  additionalActions?: CompletionAction[]
  onRestart?: () => void
  restartButtonText?: string
}

/**
 * カスタムアクション条件
 */
export type CustomActionCondition =
  | 'always'
  | 'before-result'
  | 'after-result'
  | 'traditional-only'
  | 'choice-only'
  | 'bottom'

/**
 * カスタムアクション位置
 */
export type CustomActionPosition = 'before-result' | 'after-result' | 'bottom'

/**
 * カスタムアクション
 */
export interface CustomAction {
  id: string
  label: string
  onClick: (question: QuizQuestion, index: number) => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger'
  icon?: string
  condition?: CustomActionCondition
  position?: CustomActionPosition
}

/**
 * エラー設定
 */
export interface ErrorConfig {
  title?: string
  message?: string
  onAction?: () => void
  actionLabel?: string
}

/**
 * ローディング設定
 */
export interface LoadingConfig {
  message?: string
  showSpinner?: boolean
}

/**
 * クイズ結果サマリー
 */
export interface QuizResults {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  completedQuestions: QuizQuestion[]
  incorrectQuestions: QuizQuestion[]
}
