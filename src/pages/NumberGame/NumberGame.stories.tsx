import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { NumberGameView } from './NumberGame.view'
import type { Card, GameResult } from './NumberGame.types'

const meta: Meta<typeof NumberGameView> = {
  title: 'Pages/NumberGame',
  component: NumberGameView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NumberGameView>

const mockCards: Card[] = [
  { value: 1, word: 'unu' },
  { value: 2, word: 'du' },
  { value: 3, word: 'tri' },
  { value: 5, word: 'kvin' },
  { value: 6, word: 'ses' },
  { value: 7, word: 'sep' },
  { value: 9, word: 'naŭ' },
  { value: 10, word: 'dek' },
  { value: 100, word: 'cent' },
  { value: 1000, word: 'mil' },
]

export const Initial: Story = {
  args: {
    targetNumber: 2521,
    selectedCards: [],
    cards: mockCards,
    result: { show: false, correct: false, message: '' },
    onSelectCard: (value: number, word: string) => console.log('Select card:', value, word),
    onRemoveCard: (index: number) => console.log('Remove card:', index),
    onClearSelection: () => console.log('Clear selection'),
    onCheckAnswer: () => console.log('Check answer'),
    onNewGame: () => console.log('New game'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const WithSelectedCards: Story = {
  args: {
    targetNumber: 2521,
    selectedCards: [
      { value: 2, word: 'du' },
      { value: 1000, word: 'mil' },
      { value: 5, word: 'kvin' },
    ],
    cards: mockCards,
    result: { show: false, correct: false, message: '' },
    onSelectCard: (value: number, word: string) => console.log('Select card:', value, word),
    onRemoveCard: (index: number) => console.log('Remove card:', index),
    onClearSelection: () => console.log('Clear selection'),
    onCheckAnswer: () => console.log('Check answer'),
    onNewGame: () => console.log('New game'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const CorrectAnswer: Story = {
  args: {
    targetNumber: 2521,
    selectedCards: [
      { value: 2, word: 'du' },
      { value: 1000, word: 'mil' },
      { value: 5, word: 'kvin' },
      { value: 100, word: 'cent' },
      { value: 2, word: 'du' },
      { value: 10, word: 'dek' },
      { value: 1, word: 'unu' },
    ],
    cards: mockCards,
    result: {
      show: true,
      correct: true,
      message: '🎉 正解！\n2521 = du mil kvin cent dudek unu'
    },
    onSelectCard: (value: number, word: string) => console.log('Select card:', value, word),
    onRemoveCard: (index: number) => console.log('Remove card:', index),
    onClearSelection: () => console.log('Clear selection'),
    onCheckAnswer: () => console.log('Check answer'),
    onNewGame: () => console.log('New game'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const IncorrectAnswer: Story = {
  args: {
    targetNumber: 2521,
    selectedCards: [
      { value: 1, word: 'unu' },
      { value: 2, word: 'du' },
      { value: 3, word: 'tri' },
    ],
    cards: mockCards,
    result: {
      show: true,
      correct: false,
      message: '❌ 不正解\n正解は: 2 1000 5 100 2 10 1'
    },
    onSelectCard: (value: number, word: string) => console.log('Select card:', value, word),
    onRemoveCard: (index: number) => console.log('Remove card:', index),
    onClearSelection: () => console.log('Clear selection'),
    onCheckAnswer: () => console.log('Check answer'),
    onNewGame: () => console.log('New game'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}