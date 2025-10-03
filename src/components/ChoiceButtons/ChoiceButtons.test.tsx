import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChoiceButtons } from './ChoiceButtons'
import type { ChoiceButtonsProps } from './ChoiceButtons.types'

// Mock the view component
vi.mock('./ChoiceButtons.view', () => ({
  ChoiceButtonsView: ({ props }: { props: ChoiceButtonsProps }) => (
    <div data-testid="choice-buttons">
      <div data-testid="choices-count">{props.choices.length}</div>
      <div data-testid="show-result">{props.showResult ? 'showing' : 'hidden'}</div>
      {props.selectedAnswer && (
        <div data-testid="selected">{props.selectedAnswer}</div>
      )}
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useChoiceButtons', () => ({
  useChoiceButtons: vi.fn(() => ({
    state: {},
    actions: { handleChoiceClick: vi.fn() },
  })),
}))

describe('ChoiceButtons', () => {
  const defaultProps: ChoiceButtonsProps = {
    choices: ['choice1', 'choice2', 'choice3', 'choice4'],
    showResult: false,
    onChoiceClick: vi.fn(),
  }

  it('renders with required props', () => {
    render(<ChoiceButtons {...defaultProps} />)
    expect(screen.getByTestId('choice-buttons')).toBeInTheDocument()
    expect(screen.getByTestId('choices-count')).toHaveTextContent('4')
  })

  it('renders with showResult true', () => {
    render(<ChoiceButtons {...defaultProps} showResult={true} />)
    expect(screen.getByTestId('show-result')).toHaveTextContent('showing')
  })

  it('renders with showResult false', () => {
    render(<ChoiceButtons {...defaultProps} showResult={false} />)
    expect(screen.getByTestId('show-result')).toHaveTextContent('hidden')
  })

  it('renders with selected answer', () => {
    render(<ChoiceButtons {...defaultProps} selectedAnswer="choice2" />)
    expect(screen.getByTestId('selected')).toHaveTextContent('choice2')
  })

  it('passes onChoiceClick to hook', () => {
    const { useChoiceButtons } = require('./hooks/useChoiceButtons')
    const onChoiceClick = vi.fn()

    render(<ChoiceButtons {...defaultProps} onChoiceClick={onChoiceClick} />)

    expect(useChoiceButtons).toHaveBeenCalledWith({
      onChoiceClick,
    })
  })

  it('renders with different number of choices', () => {
    render(<ChoiceButtons {...defaultProps} choices={['A', 'B']} />)
    expect(screen.getByTestId('choices-count')).toHaveTextContent('2')
  })
})
