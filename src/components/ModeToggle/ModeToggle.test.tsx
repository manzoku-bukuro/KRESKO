import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ModeToggle } from './ModeToggle'
import type { ModeToggleProps, QuizMode } from './ModeToggle.types'
import * as useModeToggleModule from './hooks/useModeToggle'

// Mock the view component
vi.mock('./ModeToggle.view', () => ({
  ModeToggleView: ({ props }: { props: ModeToggleProps }) => (
    <div data-testid="mode-toggle">
      <div data-testid="current-mode">{props.currentMode}</div>
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useModeToggle', () => ({
  useModeToggle: vi.fn(() => ({
    state: {},
    actions: {
      handleTraditionalClick: vi.fn(),
      handleMultipleChoiceClick: vi.fn(),
    },
  })),
}))

const mockedUseModeToggle = vi.mocked(useModeToggleModule.useModeToggle)

describe('ModeToggle', () => {
  const defaultProps: ModeToggleProps = {
    currentMode: 'traditional' as QuizMode,
    onModeChange: vi.fn(),
  }

  it('renders correctly', () => {
    render(<ModeToggle {...defaultProps} />)
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('renders with traditional mode', () => {
    render(<ModeToggle {...defaultProps} currentMode="traditional" />)
    expect(screen.getByTestId('current-mode')).toHaveTextContent('traditional')
  })

  it('renders with multiple-choice mode', () => {
    render(<ModeToggle {...defaultProps} currentMode="multiple-choice" />)
    expect(screen.getByTestId('current-mode')).toHaveTextContent('multiple-choice')
  })

  it('passes props to hook', () => {
    const onModeChange = vi.fn()

    render(
      <ModeToggle
        currentMode="traditional"
        onModeChange={onModeChange}
      />
    )

    expect(mockedUseModeToggle).toHaveBeenCalledWith({
      currentMode: 'traditional',
      onModeChange,
    })
  })
})
