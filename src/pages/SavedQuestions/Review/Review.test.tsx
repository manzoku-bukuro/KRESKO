import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewView } from './Review.view'
import type { ReviewViewProps } from './Review.types'
import type { WeakQuestion } from '../../../utils/firestore'
import type { QuizQuestion } from '../../../hooks'

// Mock UnifiedQuiz component
vi.mock('../../../components/UnifiedQuiz', () => ({
  UnifiedQuiz: ({ metadata, loading, error, errorConfig }: { metadata?: { title: string; subtitle: string }; loading?: boolean; error?: string; errorConfig?: { title: string; message: string; onAction: () => void; actionLabel: string } }) => {
    if (loading) {
      return <div>Loading...</div>
    }
    if (error) {
      return (
        <div>
          <h1>{errorConfig.title}</h1>
          <p>{errorConfig.message}</p>
          <button onClick={errorConfig.onAction}>{errorConfig.actionLabel}</button>
        </div>
      )
    }
    return (
      <div>
        <h1>{metadata.title}</h1>
        <p>{metadata.subtitle}</p>
      </div>
    )
  }
}))

describe('ReviewView', () => {
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

  const mockQuizQuestions: QuizQuestion[] = [
    {
      esperanto: 'kato',
      japanese: '猫',
      extra: '動物',
    },
    {
      esperanto: 'hundo',
      japanese: '犬',
    },
  ]

  const defaultProps: ReviewViewProps = {
    user: { uid: 'test-user' },
    loading: false,
    error: null,
    allWeakQuestions: mockWeakQuestions,
    quizQuestions: mockQuizQuestions,
    onUnderstood: vi.fn(),
    onNavigateToTop: vi.fn(),
    onNavigateToList: vi.fn(),
  }

  it('shows empty state when no weak questions', () => {
    render(<ReviewView {...defaultProps} allWeakQuestions={[]} />)
    expect(screen.getByText('📚 苦手問題復習')).toBeInTheDocument()
    expect(screen.getByText('🎉 素晴らしい！')).toBeInTheDocument()
    expect(screen.getByText(/復習する苦手問題がありません/)).toBeInTheDocument()
  })

  it('calls onNavigateToTop when home button is clicked in empty state', async () => {
    const user = userEvent.setup()
    render(<ReviewView {...defaultProps} allWeakQuestions={[]} />)

    await user.click(screen.getByText('🏠 ホームに戻る'))

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })

  it('renders UnifiedQuiz with correct metadata', () => {
    render(<ReviewView {...defaultProps} />)
    expect(screen.getByText('📚 苦手問題復習')).toBeInTheDocument()
    expect(screen.getByText('間違えた問題を復習しましょう')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ReviewView {...defaultProps} loading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<ReviewView {...defaultProps} error="エラーが発生しました" />)
    expect(screen.getByText('エラー')).toBeInTheDocument()
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
  })

  it('calls onNavigateToTop when error action is clicked', async () => {
    const user = userEvent.setup()
    render(<ReviewView {...defaultProps} error="エラーが発生しました" />)

    await user.click(screen.getByText('🏠 ホームに戻る'))

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })
})