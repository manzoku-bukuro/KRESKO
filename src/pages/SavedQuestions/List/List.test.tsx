import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListView } from './List.view'
import type { ListViewProps } from './List.types'
import type { WeakQuestion } from '../../../utils/firestore'

describe('ListView', () => {
  const mockWeakQuestions: WeakQuestion[] = [
    {
      esperanto: 'kato',
      japanese: '猫',
      extra: '動物',
      addedAt: new Date(),
      incorrectCount: 3,
    },
    {
      esperanto: 'hundo',
      japanese: '犬',
      addedAt: new Date(),
      incorrectCount: 1,
    },
  ]

  const defaultProps: ListViewProps = {
    user: { uid: 'test-user' },
    loading: false,
    weakQuestions: mockWeakQuestions,
    onRemoveQuestion: vi.fn(),
    onNavigateToReview: vi.fn(),
    onNavigateToTop: vi.fn(),
  }

  it('shows login required message when user is not authenticated', () => {
    render(<ListView {...defaultProps} user={null} />)
    expect(screen.getByText('🔐 ログインが必要です')).toBeInTheDocument()
    expect(screen.getByText(/ログインまたは新規登録/)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ListView {...defaultProps} loading={true} />)
    expect(screen.getByText('📚 苦手問題')).toBeInTheDocument()
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('shows empty state when no weak questions', () => {
    render(<ListView {...defaultProps} weakQuestions={[]} />)
    expect(screen.getByText('🎉 素晴らしい！')).toBeInTheDocument()
    expect(screen.getByText(/現在、苦手問題はありません/)).toBeInTheDocument()
  })

  it('displays weak questions list', () => {
    render(<ListView {...defaultProps} />)
    expect(screen.getByText('kato')).toBeInTheDocument()
    expect(screen.getByText('猫')).toBeInTheDocument()
    expect(screen.getByText('動物')).toBeInTheDocument()
    expect(screen.getByText('hundo')).toBeInTheDocument()
    expect(screen.getByText('犬')).toBeInTheDocument()
  })

  it('displays question count', () => {
    render(<ListView {...defaultProps} />)
    expect(screen.getByText(/間違えた問題を復習しましょう（2問）/)).toBeInTheDocument()
  })

  it('displays incorrect count for each question', () => {
    render(<ListView {...defaultProps} />)
    expect(screen.getByText('❌ 3回')).toBeInTheDocument()
    expect(screen.getByText('❌ 1回')).toBeInTheDocument()
  })

  it('calls onRemoveQuestion when understand button is clicked', async () => {
    const user = userEvent.setup()
    render(<ListView {...defaultProps} />)

    const understandButtons = screen.getAllByText('✅ 理解できた')
    await user.click(understandButtons[0])

    expect(defaultProps.onRemoveQuestion).toHaveBeenCalledWith('kato')
  })

  it('shows review quiz button when there are weak questions', () => {
    render(<ListView {...defaultProps} />)
    expect(screen.getByText('🎯 復習クイズ（ランダム10問）')).toBeInTheDocument()
  })

  it('hides review quiz button when no weak questions', () => {
    render(<ListView {...defaultProps} weakQuestions={[]} />)
    expect(screen.queryByText('🎯 復習クイズ（ランダム10問）')).not.toBeInTheDocument()
  })

  it('calls onNavigateToReview when review button is clicked', async () => {
    const user = userEvent.setup()
    render(<ListView {...defaultProps} />)

    await user.click(screen.getByText('🎯 復習クイズ（ランダム10問）'))

    expect(defaultProps.onNavigateToReview).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToTop when home button is clicked', async () => {
    const user = userEvent.setup()
    render(<ListView {...defaultProps} />)

    await user.click(screen.getByText('🏠 ホームに戻る'))

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })
})