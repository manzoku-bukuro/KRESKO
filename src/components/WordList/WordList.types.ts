import type { WordItem } from '../../types'

// Re-export for convenience
export type { WordItem }

export interface WordListProps {
  title: string
  words: WordItem[]
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface WordListState {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- 将来的に展開可能性のため予約
export interface WordListActions {}
