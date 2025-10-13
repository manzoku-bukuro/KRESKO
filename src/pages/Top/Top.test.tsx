import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TopView } from './Top.view'
import type { TopViewProps } from './Top.types'

describe('TopView', () => {
  const defaultProps: TopViewProps = {
    weakQuestionsCount: 0,
    isAuthenticated: false,
    showAuthModal: false,
    onNavigateToExam: vi.fn(),
    onNavigateToInterrogative: vi.fn(),
    onNavigateToNumberGame: vi.fn(),
    onNavigateToSearch: vi.fn(),
    onNavigateToWeakQuestions: vi.fn(),
    onCloseAuthModal: vi.fn(),
    onAuthSuccess: vi.fn(),
  }

  it('renders the main heading', () => {
    render(<TopView {...defaultProps} />)
    expect(screen.getByText('MEMORU')).toBeInTheDocument()
    expect(screen.getByText('カテゴリを選択')).toBeInTheDocument()
  })

  it('renders all navigation buttons', () => {
    render(<TopView {...defaultProps} />)
    expect(screen.getByText(/エス検4級/)).toBeInTheDocument()
    expect(screen.getByText(/疑問詞/)).toBeInTheDocument()
    expect(screen.getByText(/数字当てゲーム/)).toBeInTheDocument()
  })

  it('calls onNavigateToExam when exam button is clicked', async () => {
    const user = userEvent.setup()
    render(<TopView {...defaultProps} />)

    await user.click(screen.getByText(/エス検4級/))
    expect(defaultProps.onNavigateToExam).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToInterrogative when interrogative button is clicked', async () => {
    const user = userEvent.setup()
    render(<TopView {...defaultProps} />)

    await user.click(screen.getByText(/疑問詞/))
    expect(defaultProps.onNavigateToInterrogative).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToNumberGame when number game button is clicked', async () => {
    const user = userEvent.setup()
    render(<TopView {...defaultProps} />)

    await user.click(screen.getByText(/数字当てゲーム/))
    expect(defaultProps.onNavigateToNumberGame).toHaveBeenCalledTimes(1)
  })

  it('does not show weak questions button when not authenticated', () => {
    render(<TopView {...defaultProps} isAuthenticated={false} />)
    expect(screen.queryByText(/苦手問題を復習/)).not.toBeInTheDocument()
  })

  it('shows weak questions button when authenticated', () => {
    render(<TopView {...defaultProps} isAuthenticated={true} />)
    expect(screen.getByText(/苦手問題を復習/)).toBeInTheDocument()
  })

  it('shows weak questions count badge when count is greater than 0', () => {
    render(<TopView {...defaultProps} isAuthenticated={true} weakQuestionsCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not show badge when weak questions count is 0', () => {
    render(<TopView {...defaultProps} isAuthenticated={true} weakQuestionsCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('calls onNavigateToWeakQuestions when weak questions button is clicked', async () => {
    const user = userEvent.setup()
    render(<TopView {...defaultProps} isAuthenticated={true} />)

    await user.click(screen.getByText(/苦手問題を復習/))
    expect(defaultProps.onNavigateToWeakQuestions).toHaveBeenCalledTimes(1)
  })
})