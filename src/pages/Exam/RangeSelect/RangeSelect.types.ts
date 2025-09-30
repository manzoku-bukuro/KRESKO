export interface RangeOption {
  start: number
  size: number
}

export interface RangeSelectViewProps {
  category: string
  total: number
  rangeOptions10: RangeOption[]
  rangeOptions100: RangeOption[]
  categoryEmoji: string
  categoryName: string
  onSelectRange: (start: number, size: number) => void
  onNavigateToTop: () => void
}