import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuizHeader } from './QuizHeader'
import type { QuizHeaderProps } from './QuizHeader.types'

// Mock the view component
vi.mock('./QuizHeader.view', () => ({
  QuizHeaderView: ({ props }: { props: QuizHeaderProps }) => (
    <div data-testid="quiz-header">
      <div data-testid="title">{props.title}</div>
      <div data-testid="progress">{props.currentQuestion}/{props.totalQuestions}</div>
      {props.subtitle && <div data-testid="subtitle">{props.subtitle}</div>}
      {props.showModeToggle && <div data-testid="mode-toggle">ModeToggle</div>}
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useQuizHeader', () => ({
  useQuizHeader: vi.fn(() => ({
    state: {},
    actions: {},
  })),
}))

describe('QuizHeader', () => {
  const defaultProps: QuizHeaderProps = {
    title: 'Test Quiz',
    currentQuestion: 1,
    totalQuestions: 10,
  }

  it('renders with required props', () => {
    render(<QuizHeader {...defaultProps} />)
    expect(screen.getByTestId('quiz-header')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveTextContent('Test Quiz')
    expect(screen.getByTestId('progress')).toHaveTextContent('1/10')
  })

  it('renders with subtitle', () => {
    render(<QuizHeader {...defaultProps} subtitle="Subtitle text" />)
    expect(screen.getByTestId('subtitle')).toHaveTextContent('Subtitle text')
  })

  it('renders without subtitle by default', () => {
    render(<QuizHeader {...defaultProps} />)
    expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument()
  })

  it('renders with mode toggle when showModeToggle is true', () => {
    render(
      <QuizHeader
        {...defaultProps}
        showModeToggle={true}
        modeToggleProps={{
          currentMode: 'traditional',
          onModeChange: vi.fn(),
        }}
      />
    )
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('does not render mode toggle by default', () => {
    render(<QuizHeader {...defaultProps} />)
    expect(screen.queryByTestId('mode-toggle')).not.toBeInTheDocument()
  })

  it('passes props to hook', () => {
    const { useQuizHeader } = require('./hooks/useQuizHeader')
    const props: QuizHeaderProps = {
      title: 'Test',
      currentQuestion: 3,
      totalQuestions: 5,
    }

    render(<QuizHeader {...props} />)

    expect(useQuizHeader).toHaveBeenCalledWith(props)
  })
})
