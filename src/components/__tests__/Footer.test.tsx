import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../Footer'

const FooterWithRouter = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
)

describe('Footer', () => {
  it('renders correctly', () => {
    render(<FooterWithRouter />)

    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('© 2025 MEMORU. All rights reserved.')).toBeInTheDocument()
  })

  it('has correct links', () => {
    render(<FooterWithRouter />)

    const privacyLink = screen.getByText('プライバシーポリシー')
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy')

    const githubLink = screen.getByText('GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/manzoku-bukuro/MEMORU')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})