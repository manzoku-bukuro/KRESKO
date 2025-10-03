/**
 * このファイルは後方互換性のために残しています。
 * 新しいコードでは src/types から直接インポートしてください。
 *
 * @deprecated Use types from 'src/types' instead
 */

// Re-export from centralized types
export type {
  QuizMode,
  QuizQuestion,
  InterrogativeQuestionFields,
  ChoiceGenerationConfig,
  QuizEngineConfig,
  QuizEngineState,
  QuizEngineActions,
  UseQuizEngineReturn,
} from '../types'
