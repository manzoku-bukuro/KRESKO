import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Quiz } from './Quiz'
import * as useQuizModule from './hooks/useQuiz'

// Mock UnifiedQuiz component
vi.mock('../../../components/UnifiedQuiz', () => ({
  UnifiedQuiz: ({ metadata, error, errorConfig }: { metadata?: { title: string; subtitle: string }; error?: string; errorConfig?: { title: string; message: string; onAction: () => void; actionLabel: string } }) => {
    if (error && errorConfig) {
      return (
        <div>
          <h1>{errorConfig.title}</h1>
          <p>{errorConfig.message}</p>
          <button onClick={errorConfig.onAction}>{errorConfig.actionLabel}</button>
        </div>
      )
    }
    if (metadata) {
      return (
        <div>
          <h1>{metadata.title}</h1>
          <p>{metadata.subtitle}</p>
        </div>
      )
    }
    return <div>No data</div>
  },
}))

// Mock useQuiz hook
vi.mock('./hooks/useQuiz', () => ({
  useQuiz: () => ({
    category: 'esuken4',
    rangeStart: '1',
    rangeSize: '10',
    words: Array(500).fill({ esperanto: 'test', japanese: 'テスト' }),
    dataError: null,
    quizQuestions: Array(10).fill({ esperanto: 'test', japanese: 'テスト' }),
    user: { uid: 'test-user' },
    categoryEmoji: '🏆',
    categoryName: 'エス検4級',
    markAsWeak: vi.fn(),
    handleNextRange: vi.fn(),
    handleNavigateToRange: vi.fn(),
    handleNavigateToTop: vi.fn(),
    generateCustomChoices: vi.fn(),
  }),
}))

describe('Quiz', () => {
  it('renders the quiz with correct metadata', () => {
    render(<Quiz />)
    expect(screen.getByText(/🏆 エス検4級/)).toBeInTheDocument()
    expect(screen.getByText(/範囲: 1 - 10/)).toBeInTheDocument()
  })

  it('renders error state when dataError is present', () => {
    const mockedUseQuiz = vi.mocked(useQuizModule.useQuiz)

    mockedUseQuiz.mockReturnValueOnce({
      category: 'esuken4',
      rangeStart: '1',
      rangeSize: '10',
      words: [],
      dataError: 'データ読み込みエラー',
      quizQuestions: [],
      user: null,
      categoryEmoji: '🏆',
      categoryName: 'エス検4級',
      markAsWeak: vi.fn(),
      handleNextRange: vi.fn(),
      handleNavigateToRange: vi.fn(),
      handleNavigateToTop: vi.fn(),
      generateCustomChoices: vi.fn(),
    })

    render(<Quiz />)
    expect(screen.getByText('エラー')).toBeInTheDocument()
    expect(screen.getByText('データ読み込みエラー')).toBeInTheDocument()
  })
})