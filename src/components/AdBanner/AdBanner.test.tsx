import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdBanner } from './AdBanner'

// Mock the view component
vi.mock('./AdBanner.view', () => ({
  AdBannerView: ({ data }: { data: { config: { slot: string } } }) => (
    <div data-testid="ad-banner">
      <div data-testid="ad-slot">{data.config.slot}</div>
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useAdBanner', () => ({
  useAdBanner: vi.fn(({ slot, format, responsive, style }) => ({
    data: {
      config: {
        slot,
        format,
        responsive,
        style,
        adClient: 'ca-pub-9194224223065157',
      },
      isLoading: false,
      error: null,
    },
    adRef: { current: null },
  })),
}))

describe('AdBanner', () => {
  it('renders with required slot prop', () => {
    render(<AdBanner slot="1234567890" />)
    expect(screen.getByTestId('ad-banner')).toBeInTheDocument()
    expect(screen.getByTestId('ad-slot')).toHaveTextContent('1234567890')
  })

  it('passes props to the hook', () => {
    const { useAdBanner } = require('./hooks/useAdBanner')

    render(
      <AdBanner
        slot="1234567890"
        format="rectangle"
        responsive={false}
        style={{ display: 'inline-block' }}
      />
    )

    expect(useAdBanner).toHaveBeenCalledWith({
      slot: '1234567890',
      format: 'rectangle',
      responsive: false,
      style: { display: 'inline-block' },
    })
  })

  it('uses default values for optional props', () => {
    const { useAdBanner } = require('./hooks/useAdBanner')

    render(<AdBanner slot="1234567890" />)

    expect(useAdBanner).toHaveBeenCalledWith({
      slot: '1234567890',
      format: 'auto',
      responsive: true,
      style: { display: 'block' },
    })
  })
})
