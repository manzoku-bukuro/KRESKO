import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExplanationView } from './Explanation.view'
import type { ExplanationViewProps, InterrogativeInfo } from './Explanation.types'

describe('ExplanationView', () => {
  const mockInterrogatives: InterrogativeInfo[] = [
    {
      word: 'kio',
      meaning: '何',
      description: '物事や事柄を尋ねる時に使います。',
      examples: [
        { esperanto: 'Kio estas tio?', japanese: 'それは何ですか？' },
      ],
    },
    {
      word: 'kiu',
      meaning: 'だれ・どれ',
      description: '人や物を特定する時に使います。',
      examples: [
        { esperanto: 'Kiu vi estas?', japanese: 'あなたはだれですか？' },
      ],
    },
  ]

  const defaultProps: ExplanationViewProps = {
    interrogatives: mockInterrogatives,
    onNavigateToBasic: vi.fn(),
    onNavigateToAdvanced: vi.fn(),
    onNavigateToMenu: vi.fn(),
  }

  it('renders the page title', () => {
    render(<ExplanationView {...defaultProps} />)
    expect(screen.getByText('❓ 疑問詞について')).toBeInTheDocument()
    expect(screen.getByText('エスペラントの9つの疑問詞')).toBeInTheDocument()
  })

  it('renders all interrogatives', () => {
    render(<ExplanationView {...defaultProps} />)
    expect(screen.getByText('kio')).toBeInTheDocument()
    expect(screen.getByText('= 何')).toBeInTheDocument()
    expect(screen.getByText('kiu')).toBeInTheDocument()
    expect(screen.getByText('= だれ・どれ')).toBeInTheDocument()
  })

  it('renders examples for each interrogative', () => {
    render(<ExplanationView {...defaultProps} />)
    expect(screen.getByText('Kio estas tio?')).toBeInTheDocument()
    expect(screen.getByText('それは何ですか？')).toBeInTheDocument()
    expect(screen.getByText('Kiu vi estas?')).toBeInTheDocument()
    expect(screen.getByText('あなたはだれですか？')).toBeInTheDocument()
  })

  it('calls onNavigateToBasic when basic button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExplanationView {...defaultProps} />)

    await user.click(screen.getByText('📖 基本学習をスタート'))

    expect(defaultProps.onNavigateToBasic).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToAdvanced when advanced button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExplanationView {...defaultProps} />)

    await user.click(screen.getByText('🎯 応用問題をスタート'))

    expect(defaultProps.onNavigateToAdvanced).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToMenu when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExplanationView {...defaultProps} />)

    await user.click(screen.getByText('← メニューに戻る'))

    expect(defaultProps.onNavigateToMenu).toHaveBeenCalledTimes(1)
  })
})