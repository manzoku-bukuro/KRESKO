import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Basic } from './Basic'

// Mock UnifiedQuiz component
vi.mock('../../../../components/UnifiedQuiz', () => ({
  UnifiedQuiz: ({ metadata }: { metadata: { title: string; subtitle: string } }) => (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.subtitle}</p>
    </div>
  ),
}))

// Mock useBasic hook
vi.mock('./hooks/useBasic', () => ({
  useBasic: () => ({
    interrogativeQuestions: Array(9).fill({ esperanto: 'kio', japanese: '何' }),
    onNavigateToMenu: vi.fn(),
    generateChoicePool: () => ['何', 'だれ', 'どこ', 'いつ'],
  }),
}))

describe('Basic', () => {
  it('renders the quiz with correct metadata', () => {
    render(<Basic />)
    expect(screen.getByText('❓ 疑問詞 - 基本学習')).toBeInTheDocument()
    expect(screen.getByText('疑問詞の意味を覚える練習問題')).toBeInTheDocument()
  })
})