import type { Word } from './Word'

/**
 * クイズモード
 */
export type QuizMode = 'traditional' | 'multiple-choice'

/**
 * 疑問詞応用問題用の追加フィールド
 */
export interface InterrogativeQuestionFields {
  translation?: string  // 日本語訳
  blanks?: string[]     // 選択肢候補
}

/**
 * クイズ問題型
 * WordをベースにInterrogativeQuestionFieldsを追加可能
 * 各ページで独自フィールドを追加できるようインデックスシグネチャを持つ
 */
export interface QuizQuestion extends Word, Partial<InterrogativeQuestionFields> {
  [key: string]: unknown
}

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

/**
 * 選択肢生成の設定
 */
export interface ChoiceGenerationConfig {
  choiceCount?: number
  generateFromPool?: (questions: QuizQuestion[]) => string[]
  generateCustomChoices?: (currentQuestion: QuizQuestion, allQuestions: QuizQuestion[]) => string[]
}

/**
 * クイズエンジンの設定
 */
export interface QuizEngineConfig {
  initialMode?: QuizMode
  maxQuestions?: number
  shuffleQuestions?: boolean
  choiceGeneration?: ChoiceGenerationConfig
  enableIncorrectTracking?: boolean
  onIncorrectAnswer?: (question: QuizQuestion, index: number) => void
  onCorrectAnswer?: (question: QuizQuestion, index: number) => void
}

/**
 * クイズエンジンの状態
 */
export interface QuizEngineState {
  // 問題データ
  questions: QuizQuestion[]
  currentIndex: number
  finished: boolean

  // 表示状態
  quizMode: QuizMode
  showAnswer: boolean
  selectedAnswer: string | null
  showResult: boolean
  choices: string[]

  // 結果追跡
  incorrectQuestions: number[]
  correctQuestions: number[]

  // 進捗
  progress: number
  isLastQuestion: boolean
}

/**
 * クイズエンジンのアクション
 */
export interface QuizEngineActions {
  // 初期化
  initializeQuiz: (questions: QuizQuestion[], config?: Partial<QuizEngineConfig>) => void
  resetQuiz: () => void

  // モード制御
  setQuizMode: (mode: QuizMode) => void

  // 問題進行
  handleChoiceClick: (choice: string) => void
  handleTraditionalClick: () => void
  nextQuestion: () => void

  // 選択肢管理
  generateChoices: () => void

  // その他
  markAsIncorrect: () => void
  markAsCorrect: () => void
}

/**
 * useQuizEngineの戻り値
 */
export interface UseQuizEngineReturn {
  state: QuizEngineState
  actions: QuizEngineActions
}
