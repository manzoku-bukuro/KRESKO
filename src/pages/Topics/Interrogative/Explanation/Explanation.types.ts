export interface InterrogativeExample {
  esperanto: string
  japanese: string
}

export interface InterrogativeInfo {
  word: string
  meaning: string
  description: string
  examples: InterrogativeExample[]
}

export interface ExplanationViewProps {
  interrogatives: InterrogativeInfo[]
  onNavigateToBasic: () => void
  onNavigateToAdvanced: () => void
  onNavigateToMenu: () => void
}