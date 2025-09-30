import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuView } from './Menu.view'
import type { MenuViewProps } from './Menu.types'

describe('MenuView', () => {
  const defaultProps: MenuViewProps = {
    onNavigateToExplanation: vi.fn(),
    onNavigateToBasic: vi.fn(),
    onNavigateToAdvanced: vi.fn(),
    onNavigateToTop: vi.fn(),
  }

  it('renders the menu title', () => {
    render(<MenuView {...defaultProps} />)
    expect(screen.getByText('❓ 疑問詞学習')).toBeInTheDocument()
    expect(screen.getByText('学習方法を選択してください')).toBeInTheDocument()
  })

  it('renders all three learning options', () => {
    render(<MenuView {...defaultProps} />)
    expect(screen.getByText('📚 疑問詞について')).toBeInTheDocument()
    expect(screen.getByText('📖 基本学習')).toBeInTheDocument()
    expect(screen.getByText('🎯 応用問題')).toBeInTheDocument()
  })

  it('calls onNavigateToExplanation when explanation button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuView {...defaultProps} />)

    await user.click(screen.getByText('疑問詞の説明を読む'))

    expect(defaultProps.onNavigateToExplanation).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToBasic when basic button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuView {...defaultProps} />)

    await user.click(screen.getByText('基本学習をスタート'))

    expect(defaultProps.onNavigateToBasic).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToAdvanced when advanced button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuView {...defaultProps} />)

    await user.click(screen.getByText('応用問題をスタート'))

    expect(defaultProps.onNavigateToAdvanced).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToTop when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuView {...defaultProps} />)

    await user.click(screen.getByText('← カテゴリに戻る'))

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })
})