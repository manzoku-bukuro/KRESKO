import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WordList } from './WordList'
import type { WordListProps } from './WordList.types'

// Mock the view component
vi.mock('./WordList.view', () => ({
  WordListView: ({ props }: { props: WordListProps }) => (
    <div data-testid="word-list">
      <div data-testid="title">{props.title}</div>
      <div data-testid="words-count">{props.words.length}</div>
      {props.words.map((word, index) => (
        <div key={index} data-testid={`word-${index}`}>
          {word.primary} - {word.secondary}
        </div>
      ))}
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useWordList', () => ({
  useWordList: vi.fn(() => ({
    state: {},
    actions: {},
  })),
}))

describe('WordList', () => {
  const defaultProps: WordListProps = {
    title: 'Test Words',
    words: [
      { primary: 'saluton', secondary: 'こんにちは' },
      { primary: 'dankon', secondary: 'ありがとう' },
    ],
  }

  it('renders with required props', () => {
    render(<WordList {...defaultProps} />)
    expect(screen.getByTestId('word-list')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveTextContent('Test Words')
    expect(screen.getByTestId('words-count')).toHaveTextContent('2')
  })

  it('renders all words', () => {
    render(<WordList {...defaultProps} />)
    expect(screen.getByTestId('word-0')).toHaveTextContent('saluton - こんにちは')
    expect(screen.getByTestId('word-1')).toHaveTextContent('dankon - ありがとう')
  })

  it('renders with empty words array', () => {
    render(<WordList title="Empty" words={[]} />)
    expect(screen.getByTestId('words-count')).toHaveTextContent('0')
  })

  it('renders words with extra information', () => {
    const props: WordListProps = {
      title: 'Words with Extra',
      words: [
        {
          primary: 'saluton',
          secondary: 'こんにちは',
          extra: '挨拶',
        },
      ],
    }

    render(<WordList {...props} />)
    expect(screen.getByTestId('word-0')).toBeInTheDocument()
  })

  it('passes props to hook', () => {
    const { useWordList } = require('./hooks/useWordList')

    render(<WordList {...defaultProps} />)

    expect(useWordList).toHaveBeenCalledWith(defaultProps)
  })
})
