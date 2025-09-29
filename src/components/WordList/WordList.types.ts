export interface WordItem {
  primary: string       // メインテキスト（エスペラント語、疑問詞、問題文など）
  secondary: string     // サブテキスト（日本語、意味、翻訳など）
  extra?: string        // 追加情報（意味続きなど）
  isIncorrect?: boolean // 間違いフラグ
  incorrectLabel?: string // 間違いマーカーのラベル
}

export interface WordListProps {
  title: string
  words: WordItem[]
  className?: string
}

export interface WordListState {
  // 将来的に展開可能性のため予約
}

export interface WordListActions {
  // 将来的に展開可能性のため予約
}