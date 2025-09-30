import { type QuizEngineConfig, type QuizQuestion } from '../../hooks'

// Re-export QuizQuestion for convenience
export type { QuizQuestion }

// クイズのメタデータ
export interface QuizMetadata {
  title: string
  subtitle: string
  emoji?: string
  backButtonText?: string
  backButtonPath?: string
}

// 完了画面の設定
export interface CompletionConfig {
  title?: string
  subtitle?: string
  showWordList?: boolean
  wordListTitle?: string
  additionalActions?: CompletionAction[]
  onRestart?: () => void
  restartButtonText?: string
}

export interface CompletionAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  icon?: string
}

// カスタムアクション（苦手問題削除など）
export interface CustomAction {
  id: string
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  condition?: 'always' | 'traditional-only' | 'choice-only' | 'result-only'
  position?: 'before-result' | 'after-result' | 'bottom'
  onClick: (currentQuestion: QuizQuestion, questionIndex: number) => void | Promise<void>
}

// ローディング画面の設定
export interface LoadingConfig {
  message?: string
  showSpinner?: boolean
}

// エラー画面の設定
export interface ErrorConfig {
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

// 統一Quizコンポーネントのprops
export interface UnifiedQuizProps {
  // 必須設定
  questions: QuizQuestion[]
  metadata: QuizMetadata

  // エンジン設定
  engineConfig?: Partial<QuizEngineConfig>

  // UI設定
  completionConfig?: CompletionConfig
  customActions?: CustomAction[]

  // 状態制御
  loading?: boolean
  loadingConfig?: LoadingConfig
  error?: string
  errorConfig?: ErrorConfig

  // イベント
  onQuizComplete?: (results: QuizResults) => void
  onQuizExit?: () => void
}

// クイズ結果の型
export interface QuizResults {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  completedQuestions: QuizQuestion[]
  incorrectQuestions: QuizQuestion[]
  timeTaken?: number
}