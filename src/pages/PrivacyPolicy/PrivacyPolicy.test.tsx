import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrivacyPolicyView } from './PrivacyPolicy.view'
import type { PrivacyPolicyViewProps } from './PrivacyPolicy.types'

describe('PrivacyPolicyView', () => {
  const defaultProps: PrivacyPolicyViewProps = {
    onBack: vi.fn(),
  }

  it('renders the privacy policy heading', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByText(/基本方針/)).toBeInTheDocument()
    expect(screen.getByText(/収集する情報/)).toBeInTheDocument()
    expect(screen.getByText(/Cookieの使用/)).toBeInTheDocument()
    expect(screen.getByText(/広告配信について/)).toBeInTheDocument()
    expect(screen.getByText(/第三者への情報提供/)).toBeInTheDocument()
    expect(screen.getByText(/情報の管理/)).toBeInTheDocument()
    expect(screen.getByText(/プライバシーポリシーの変更/)).toBeInTheDocument()
    expect(screen.getByText(/お問い合わせ/)).toBeInTheDocument()
  })

  it('renders Google Analytics information', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByText(/Google Analyticsを使用/)).toBeInTheDocument()
  })

  it('renders Google AdSense information', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByText(/Google AdSenseを使用/)).toBeInTheDocument()
  })

  it('renders external links with correct attributes', () => {
    render(<PrivacyPolicyView {...defaultProps} />)

    const googleAdLink = screen.getByRole('link', { name: /Google広告設定/ })
    expect(googleAdLink).toHaveAttribute('href', 'https://adssettings.google.com/')
    expect(googleAdLink).toHaveAttribute('target', '_blank')
    expect(googleAdLink).toHaveAttribute('rel', 'noopener noreferrer')

    const githubLink = screen.getByRole('link', { name: /リポジトリ/ })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/manzoku-bukuro/MEMORU')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the establishment date', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByText(/制定日：2025年9月20日/)).toBeInTheDocument()
  })

  it('renders the back button', () => {
    render(<PrivacyPolicyView {...defaultProps} />)
    expect(screen.getByRole('button', { name: '戻る' })).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<PrivacyPolicyView {...defaultProps} />)

    const backButton = screen.getByRole('button', { name: '戻る' })
    await user.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })
})