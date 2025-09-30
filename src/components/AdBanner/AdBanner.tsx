import { AdBannerView } from './AdBanner.view'
import { useAdBanner } from './hooks/useAdBanner'
import type { AdBannerProps } from './AdBanner.types'

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' }
}) => {
  const { data, adRef } = useAdBanner({
    slot,
    format,
    responsive,
    style
  })

  return <AdBannerView data={data} adRef={adRef} />
}