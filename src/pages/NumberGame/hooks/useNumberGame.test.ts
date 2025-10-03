import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNumberGame } from './useNumberGame'
import * as utils from '../../../utils/seo'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('../../../utils/seo', () => ({
  updatePageMeta: vi.fn(),
  seoData: {
    numberGame: {
      title: 'Number Game',
      description: 'Test description',
    },
  },
}))

describe('useNumberGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useNumberGame())

    expect(result.current.targetNumber).toBe(2521)
    expect(result.current.selectedCards).toEqual([])
    expect(result.current.cards).toHaveLength(12) // All Esperanto number cards
    expect(result.current.result.show).toBe(false)
  })

  it('calls updatePageMeta on mount', () => {
    renderHook(() => useNumberGame())

    expect(utils.updatePageMeta).toHaveBeenCalledWith(
      'Number Game',
      'Test description'
    )
  })

  it('creates 12 shuffled cards', () => {
    const { result } = renderHook(() => useNumberGame())

    expect(result.current.cards).toHaveLength(12)
    const values = result.current.cards.map(c => c.value)
    expect(values).toContain(1)
    expect(values).toContain(10)
    expect(values).toContain(100)
    expect(values).toContain(1000)
  })

  it('selects a card', () => {
    const { result } = renderHook(() => useNumberGame())

    act(() => {
      result.current.onSelectCard(2, 'du')
    })

    expect(result.current.selectedCards).toHaveLength(1)
    expect(result.current.selectedCards[0]).toEqual({ value: 2, word: 'du' })
  })

  it('removes a card by index', () => {
    const { result } = renderHook(() => useNumberGame())

    act(() => {
      result.current.onSelectCard(2, 'du')
      result.current.onSelectCard(5, 'kvin')
    })

    expect(result.current.selectedCards).toHaveLength(2)

    act(() => {
      result.current.onRemoveCard(0)
    })

    expect(result.current.selectedCards).toHaveLength(1)
    expect(result.current.selectedCards[0].word).toBe('kvin')
  })

  it('clears all selected cards', () => {
    const { result } = renderHook(() => useNumberGame())

    act(() => {
      result.current.onSelectCard(2, 'du')
      result.current.onSelectCard(5, 'kvin')
    })

    expect(result.current.selectedCards).toHaveLength(2)

    act(() => {
      result.current.onClearSelection()
    })

    expect(result.current.selectedCards).toHaveLength(0)
    expect(result.current.result.show).toBe(false)
  })

  it('checks correct answer', () => {
    const { result } = renderHook(() => useNumberGame())

    // For 2521: [2, 1000, 5, 100, 2, 10, 1]
    act(() => {
      result.current.onSelectCard(2, 'du')
      result.current.onSelectCard(1000, 'mil')
      result.current.onSelectCard(5, 'kvin')
      result.current.onSelectCard(100, 'cent')
      result.current.onSelectCard(2, 'du')
      result.current.onSelectCard(10, 'dek')
      result.current.onSelectCard(1, 'unu')
    })

    act(() => {
      result.current.onCheckAnswer()
    })

    expect(result.current.result.show).toBe(true)
    expect(result.current.result.correct).toBe(true)
    expect(result.current.result.message).toContain('正解')
  })

  it('checks incorrect answer', () => {
    const { result } = renderHook(() => useNumberGame())

    act(() => {
      result.current.onSelectCard(1, 'unu')
    })

    act(() => {
      result.current.onCheckAnswer()
    })

    expect(result.current.result.show).toBe(true)
    expect(result.current.result.correct).toBe(false)
    expect(result.current.result.message).toContain('正解は')
  })

  it('generates a new game', async () => {
    const { result } = renderHook(() => useNumberGame())

    act(() => {
      result.current.onSelectCard(2, 'du')
    })

    act(() => {
      result.current.onNewGame()
    })

    await waitFor(() => {
      expect(result.current.selectedCards).toHaveLength(0)
      expect(result.current.result.show).toBe(false)
      // New number might be same (low probability), but selection should be cleared
    })
  })
})