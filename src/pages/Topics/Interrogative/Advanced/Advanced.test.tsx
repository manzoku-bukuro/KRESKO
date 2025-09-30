import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Advanced } from './Advanced'

// Mock UnifiedQuiz component
vi.mock('../../../../components/UnifiedQuiz', () => ({
  UnifiedQuiz: ({ metadata }: any) => (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.subtitle}</p>
    </div>
  ),
}))

// Mock useAdvanced hook
vi.mock('./hooks/useAdvanced', () => ({
  useAdvanced: () => ({
    quizQuestions: Array(5).fill({
      esperanto: 'Test sentence',
      japanese: '何',
      blanks: ['何', 'だれ', 'どこ', 'いつ'],
    }),
    onNavigateToMenu: vi.fn(),
    generateChoicePool: () => ['何', 'だれ', 'どこ', 'いつ'],
  }),
}))

describe('Advanced', () => {
  it('renders the quiz with correct metadata', () => {
    render(<Advanced />)
    expect(screen.getByText('❓ 疑問詞 - 応用問題')).toBeInTheDocument()
    expect(screen.getByText('日本語文の穴埋めで疑問詞を選択する実践問題')).toBeInTheDocument()
  })
})