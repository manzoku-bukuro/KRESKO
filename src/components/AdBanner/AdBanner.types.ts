declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[]
  }
}

export interface AdBannerProps {
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
}

export {}  // Make this a module