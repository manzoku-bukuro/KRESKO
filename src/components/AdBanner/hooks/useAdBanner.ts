import { useEffect, useRef } from 'react'

export interface AdBannerConfig {
  slot: string
  format: string
  responsive: boolean
  style: React.CSSProperties
  adClient: string
}

export interface AdBannerData {
  config: AdBannerConfig
  isLoading: boolean
  error: Error | null
}

export const useAdBanner = ({
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' }
}: {
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
}) => {
  const adRef = useRef<HTMLModElement>(null)
  const isLoading = useRef(true)
  const error = useRef<Error | null>(null)

  useEffect(() => {
    const loadAd = () => {
      try {
        // Ensure adsbygoogle is available
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
          isLoading.current = false
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error('AdSense loading error')
        error.current = errorMessage
        console.error('AdSense error:', err)
        isLoading.current = false
      }
    }

    // Load ad after component mounts
    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [])

  const config: AdBannerConfig = {
    slot,
    format,
    responsive,
    style,
    adClient: 'ca-pub-9194224223065157'
  }

  const data: AdBannerData = {
    config,
    isLoading: isLoading.current,
    error: error.current
  }

  return {
    data,
    adRef
  }
}