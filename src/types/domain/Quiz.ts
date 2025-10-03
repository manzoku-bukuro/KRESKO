import type { Word } from './Word'

/**
 * クイズ問題型
 * hooks/useQuizEngine.types.tsの QuizQuestion と互換性を持たせるため、
 * インデックスシグネチャを追加
 */
export interface QuizQuestion extends Word {
  [key: string]: unknown
}

/**
 * クイズモード
 */
export type QuizMode = 'traditional' | 'multiple-choice'

/**
 * クイズ結果
 */
export interface QuizResult {
  question: QuizQuestion
  index: number
  isCorrect: boolean
  selectedAnswer?: string
  timestamp: Date
}
