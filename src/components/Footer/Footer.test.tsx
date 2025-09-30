import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './Footer'
import { FooterView } from './Footer.view'
import { useFooterData } from './hooks/useFooterData'

const FooterWithRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('Footer', () => {
  describe('Integration Tests', () => {
    it('renders correctly', () => {
      render(
        <FooterWithRouter>
          <Footer />
        </FooterWithRouter>
      )

      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
      expect(screen.getByText('GitHub')).toBeInTheDocument()
      expect(screen.getByText('© 2025 MEMORU. All rights reserved.')).toBeInTheDocument()
    })

    it('has correct links', () => {
      render(
        <FooterWithRouter>
          <Footer />
        </FooterWithRouter>
      )

      const privacyLink = screen.getByText('プライバシーポリシー')
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy')

      const githubLink = screen.getByText('GitHub')
      expect(githubLink).toHaveAttribute('href', 'https://github.com/manzoku-bukuro/MEMORU')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('FooterView Component', () => {
    const mockData = {
      links: {
        privacy: {
          text: 'Test Privacy',
          to: '/test-privacy'
        },
        github: {
          text: 'Test GitHub',
          href: 'https://test.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      },
      copyright: 'Test Copyright'
    }

    it('renders with provided data', () => {
      render(
        <FooterWithRouter>
          <FooterView data={mockData} />
        </FooterWithRouter>
      )

      expect(screen.getByText('Test Privacy')).toBeInTheDocument()
      expect(screen.getByText('Test GitHub')).toBeInTheDocument()
      expect(screen.getByText('Test Copyright')).toBeInTheDocument()
    })

    it('renders links with correct attributes', () => {
      render(
        <FooterWithRouter>
          <FooterView data={mockData} />
        </FooterWithRouter>
      )

      const privacyLink = screen.getByText('Test Privacy')
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/test-privacy')

      const githubLink = screen.getByText('Test GitHub')
      expect(githubLink).toHaveAttribute('href', 'https://test.com')
    })
  })

  describe('useFooterData Hook', () => {
    it('returns correct data structure', () => {
      const TestComponent = () => {
        const { data } = useFooterData()
        return (
          <div>
            <span data-testid="privacy-text">{data.links.privacy.text}</span>
            <span data-testid="github-text">{data.links.github.text}</span>
            <span data-testid="copyright">{data.copyright}</span>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('privacy-text')).toHaveTextContent('プライバシーポリシー')
      expect(screen.getByTestId('github-text')).toHaveTextContent('GitHub')
      expect(screen.getByTestId('copyright')).toHaveTextContent('© 2025 MEMORU. All rights reserved.')
    })
  })
})