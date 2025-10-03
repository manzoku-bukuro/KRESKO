import type {
  QuizQuestion,
  QuizEngineConfig,
  QuizMetadata,
  CompletionConfig,
  CustomAction,
  ErrorConfig,
  LoadingConfig,
  QuizResults,
} from '@/types'

// Re-export for convenience
export type {
  QuizQuestion,
  QuizEngineConfig,
  QuizMetadata,
  CompletionConfig,
  CustomAction,
  ErrorConfig,
  LoadingConfig,
  QuizResults,
}

export interface UnifiedQuizProps {
  // 問題データ
  questions: QuizQuestion[]

  // メタデータ
  metadata: QuizMetadata

  // クイズエンジン設定
  engineConfig?: Partial<QuizEngineConfig>

  // 完了画面設定
  completionConfig?: CompletionConfig

  // カスタムアクション（苦手問題マーク等）
  customActions?: CustomAction[]

  // ローディング状態
  loading?: boolean
  loadingConfig?: LoadingConfig

  // エラー状態
  error?: string | null
  errorConfig?: ErrorConfig

  // コールバック
  onQuizComplete?: (results: QuizResults) => void
  onQuizExit?: () => void
}
