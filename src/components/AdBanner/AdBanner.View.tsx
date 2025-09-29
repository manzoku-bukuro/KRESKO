import type { AdBannerData } from './hooks/useAdBanner'

interface AdBannerViewProps {
  data: AdBannerData
  adRef: React.RefObject<HTMLModElement | null>
}

export const AdBannerView = ({ data, adRef }: AdBannerViewProps) => {
  const { config, error } = data

  if (error) {
    return (
      <div style={{
        ...config.style,
        color: '#999',
        fontSize: '0.8rem',
        textAlign: 'center',
        padding: '10px'
      }}>
        広告の読み込みに失敗しました
      </div>
    )
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={config.style}
      data-ad-client={config.adClient}
      data-ad-slot={config.slot}
      data-ad-format={config.format}
      data-full-width-responsive={config.responsive.toString()}
    />
  )
}