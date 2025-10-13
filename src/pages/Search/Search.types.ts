export type SearchMode = 'japanese' | 'esperanto'

export interface SearchResult {
  index: number
  esperanto: string
  japanese: string
  extra?: string
}

export interface SearchViewProps {
  searchMode: SearchMode
  searchQuery: string
  results: SearchResult[]
  isSearching: boolean
  onSearchModeChange: (mode: SearchMode) => void
  onSearchQueryChange: (query: string) => void
  onResultClick: (index: number) => void
  onNavigateToTop: () => void
}
