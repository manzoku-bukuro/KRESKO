export interface WordListItem {
  index: number
  esperanto: string
  japanese: string
}

export interface WordListViewProps {
  categoryName: string
  categoryEmoji: string
  words: WordListItem[]
  onWordClick: (index: number) => void
  onNavigateToTop: () => void
}
