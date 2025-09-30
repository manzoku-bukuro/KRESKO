import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RangeSelectView } from './RangeSelect.view'
import type { RangeSelectViewProps } from './RangeSelect.types'

describe('RangeSelectView', () => {
  const defaultProps: RangeSelectViewProps = {
    category: 'esuken4',
    total: 500,
    rangeOptions10: [
      { start: 1, size: 10 },
      { start: 11, size: 10 },
      { start: 21, size: 10 },
    ],
    rangeOptions100: [
      { start: 1, size: 100 },
      { start: 101, size: 100 },
    ],
    categoryEmoji: '🏆',
    categoryName: 'エス検4級',
    onSelectRange: vi.fn(),
    onNavigateToTop: vi.fn(),
  }

  it('renders the category name and emoji', () => {
    render(<RangeSelectView {...defaultProps} />)
    expect(screen.getByText(/🏆 エス検4級/)).toBeInTheDocument()
  })

  it('displays total word count', () => {
    render(<RangeSelectView {...defaultProps} />)
    expect(screen.getByText(/全500語/)).toBeInTheDocument()
  })

  it('renders range options for 10 words', () => {
    render(<RangeSelectView {...defaultProps} />)
    expect(screen.getByText('1 - 10')).toBeInTheDocument()
    expect(screen.getByText('11 - 20')).toBeInTheDocument()
    expect(screen.getByText('21 - 30')).toBeInTheDocument()
  })

  it('renders range options for 100 words', () => {
    render(<RangeSelectView {...defaultProps} />)
    expect(screen.getByText('1 - 100')).toBeInTheDocument()
    expect(screen.getByText('101 - 200')).toBeInTheDocument()
  })

  it('calls onSelectRange when a range button is clicked', async () => {
    const user = userEvent.setup()
    render(<RangeSelectView {...defaultProps} />)

    const rangeButton = screen.getByText('1 - 10')
    await user.click(rangeButton)

    expect(defaultProps.onSelectRange).toHaveBeenCalledWith(1, 10)
  })

  it('renders all challenge button', () => {
    render(<RangeSelectView {...defaultProps} />)
    expect(screen.getByText(/🎯 全部チャレンジ \(500語\)/)).toBeInTheDocument()
  })

  it('calls onSelectRange with full range when all challenge button is clicked', async () => {
    const user = userEvent.setup()
    render(<RangeSelectView {...defaultProps} />)

    const allButton = screen.getByText(/🎯 全部チャレンジ/)
    await user.click(allButton)

    expect(defaultProps.onSelectRange).toHaveBeenCalledWith(1, 500)
  })

  it('calls onNavigateToTop when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<RangeSelectView {...defaultProps} />)

    const backButton = screen.getByText('← カテゴリに戻る')
    await user.click(backButton)

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })

  it('correctly calculates end range for last option', () => {
    const props = {
      ...defaultProps,
      total: 505,
      rangeOptions10: [
        { start: 1, size: 10 },
        { start: 501, size: 10 }, // Should display 501 - 505
      ],
    }
    render(<RangeSelectView {...props} />)
    expect(screen.getByText('501 - 505')).toBeInTheDocument()
  })
})