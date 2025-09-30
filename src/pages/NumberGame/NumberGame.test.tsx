import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberGameView } from './NumberGame.view'
import type { NumberGameViewProps, Card, GameResult } from './NumberGame.types'

describe('NumberGameView', () => {
  const mockCards: Card[] = [
    { value: 1, word: 'unu' },
    { value: 2, word: 'du' },
    { value: 10, word: 'dek' },
    { value: 100, word: 'cent' },
  ]

  const defaultProps: NumberGameViewProps = {
    targetNumber: 2521,
    selectedCards: [],
    cards: mockCards,
    result: { show: false, correct: false, message: '' },
    onSelectCard: vi.fn(),
    onRemoveCard: vi.fn(),
    onClearSelection: vi.fn(),
    onCheckAnswer: vi.fn(),
    onNewGame: vi.fn(),
    onNavigateToTop: vi.fn(),
  }

  it('renders the game title', () => {
    render(<NumberGameView {...defaultProps} />)
    expect(screen.getByText(/数字当てゲーム/)).toBeInTheDocument()
    expect(screen.getByText(/エスペラント語で表現してください/)).toBeInTheDocument()
  })

  it('displays the target number', () => {
    render(<NumberGameView {...defaultProps} />)
    expect(screen.getByText('2521')).toBeInTheDocument()
  })

  it('displays empty selection message when no cards are selected', () => {
    render(<NumberGameView {...defaultProps} />)
    expect(screen.getByText(/カードを選択してください/)).toBeInTheDocument()
  })

  it('displays selected cards', () => {
    const selectedCards: Card[] = [
      { value: 2, word: 'du' },
      { value: 1000, word: 'mil' },
    ]
    render(<NumberGameView {...defaultProps} selectedCards={selectedCards} />)

    expect(screen.getByText('du')).toBeInTheDocument()
    expect(screen.getByText('mil')).toBeInTheDocument()
    expect(screen.queryByText(/カードを選択してください/)).not.toBeInTheDocument()
  })

  it('renders all available cards', () => {
    render(<NumberGameView {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'unu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'du' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'dek' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cent' })).toBeInTheDocument()
  })

  it('calls onSelectCard when a card is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberGameView {...defaultProps} />)

    const card = screen.getByRole('button', { name: 'unu' })
    await user.click(card)

    expect(defaultProps.onSelectCard).toHaveBeenCalledWith(1, 'unu')
  })

  it('calls onRemoveCard when a selected card is clicked', async () => {
    const user = userEvent.setup()
    const selectedCards: Card[] = [{ value: 2, word: 'du' }]
    render(<NumberGameView {...defaultProps} selectedCards={selectedCards} />)

    const selectedCard = screen.getByText('du')
    await user.click(selectedCard)

    expect(defaultProps.onRemoveCard).toHaveBeenCalledWith(0)
  })

  it('disables check answer button when no cards are selected', () => {
    render(<NumberGameView {...defaultProps} />)
    const checkButton = screen.getByRole('button', { name: /答えをチェック/ })
    expect(checkButton).toBeDisabled()
  })

  it('enables check answer button when cards are selected', () => {
    const selectedCards: Card[] = [{ value: 2, word: 'du' }]
    render(<NumberGameView {...defaultProps} selectedCards={selectedCards} />)

    const checkButton = screen.getByRole('button', { name: /答えをチェック/ })
    expect(checkButton).not.toBeDisabled()
  })

  it('calls onCheckAnswer when check answer button is clicked', async () => {
    const user = userEvent.setup()
    const selectedCards: Card[] = [{ value: 2, word: 'du' }]
    render(<NumberGameView {...defaultProps} selectedCards={selectedCards} />)

    const checkButton = screen.getByRole('button', { name: /答えをチェック/ })
    await user.click(checkButton)

    expect(defaultProps.onCheckAnswer).toHaveBeenCalledTimes(1)
  })

  it('hides check answer button when result is shown', () => {
    const result: GameResult = { show: true, correct: true, message: '正解！' }
    render(<NumberGameView {...defaultProps} result={result} />)

    expect(screen.queryByRole('button', { name: /答えをチェック/ })).not.toBeInTheDocument()
  })

  it('disables clear button when no cards are selected and no result', () => {
    render(<NumberGameView {...defaultProps} />)
    const clearButton = screen.getByRole('button', { name: /選択をクリア/ })
    expect(clearButton).toBeDisabled()
  })

  it('calls onClearSelection when clear button is clicked', async () => {
    const user = userEvent.setup()
    const selectedCards: Card[] = [{ value: 2, word: 'du' }]
    render(<NumberGameView {...defaultProps} selectedCards={selectedCards} />)

    const clearButton = screen.getByRole('button', { name: /選択をクリア/ })
    await user.click(clearButton)

    expect(defaultProps.onClearSelection).toHaveBeenCalledTimes(1)
  })

  it('calls onNewGame when new game button is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberGameView {...defaultProps} />)

    const newGameButton = screen.getByRole('button', { name: /新しい問題/ })
    await user.click(newGameButton)

    expect(defaultProps.onNewGame).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateToTop when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<NumberGameView {...defaultProps} />)

    const backButton = screen.getByRole('button', { name: /トップに戻る/ })
    await user.click(backButton)

    expect(defaultProps.onNavigateToTop).toHaveBeenCalledTimes(1)
  })
})