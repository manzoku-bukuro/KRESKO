/**
 * 単語表示用の型
 * AnswerResult, WordListなどで使用
 */
export interface WordDisplay {
  primary?: string     // メインテキスト（エスペラント語、疑問詞、問題文など）
  secondary?: string   // サブテキスト（日本語、意味、翻訳など）
  extra?: string      // 追加情報・解説
}

/**
 * 単語リスト項目
 */
export interface WordItem extends WordDisplay {
  isIncorrect?: boolean      // 間違いフラグ
  incorrectLabel?: string    // 間違いマーカーのラベル
}

/**
 * 結果タイプ
 */
export type ResultType = 'correct' | 'wrong' | 'neutral'
