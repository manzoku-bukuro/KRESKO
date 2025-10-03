import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnswerResult } from './AnswerResult'
import type { AnswerResultProps } from './AnswerResult.types'

// Mock the view component
vi.mock('./AnswerResult.view', () => ({
  AnswerResultView: ({ props }: { props: AnswerResultProps }) => (
    <div data-testid="answer-result">
      <div data-testid="variant">{props.variant}</div>
      <div data-testid="result-type">{props.resultType || 'none'}</div>
      <div data-testid="visible">{props.isVisible ? 'visible' : 'hidden'}</div>
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useAnswerResult', () => ({
  useAnswerResult: vi.fn(() => ({
    state: { isAnimating: false },
    actions: { handleNext: vi.fn() },
  })),
}))

describe('AnswerResult', () => {
  const defaultProps: AnswerResultProps = {
    variant: 'traditional',
    isVisible: true,
  }

  it('renders with required props', () => {
    render(<AnswerResult {...defaultProps} />)
    expect(screen.getByTestId('answer-result')).toBeInTheDocument()
    expect(screen.getByTestId('variant')).toHaveTextContent('traditional')
  })

  it('renders with choice variant', () => {
    render(<AnswerResult {...defaultProps} variant="choice" />)
    expect(screen.getByTestId('variant')).toHaveTextContent('choice')
  })

  it('renders with game variant', () => {
    render(<AnswerResult {...defaultProps} variant="game" />)
    expect(screen.getByTestId('variant')).toHaveTextContent('game')
  })

  it('renders with correct result type', () => {
    render(<AnswerResult {...defaultProps} resultType="correct" />)
    expect(screen.getByTestId('result-type')).toHaveTextContent('correct')
  })

  it('renders with wrong result type', () => {
    render(<AnswerResult {...defaultProps} resultType="wrong" />)
    expect(screen.getByTestId('result-type')).toHaveTextContent('wrong')
  })

  it('renders with neutral result type', () => {
    render(<AnswerResult {...defaultProps} resultType="neutral" />)
    expect(screen.getByTestId('result-type')).toHaveTextContent('neutral')
  })

  it('renders when not visible', () => {
    render(<AnswerResult {...defaultProps} isVisible={false} />)
    expect(screen.getByTestId('visible')).toHaveTextContent('hidden')
  })

  it('passes onNext handler to hook', () => {
    const { useAnswerResult } = require('./hooks/useAnswerResult')
    const onNext = vi.fn()

    render(<AnswerResult {...defaultProps} onNext={onNext} />)

    expect(useAnswerResult).toHaveBeenCalledWith({
      onNext,
      isVisible: true,
    })
  })
})
