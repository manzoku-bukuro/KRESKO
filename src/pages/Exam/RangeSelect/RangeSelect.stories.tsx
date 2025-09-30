import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { RangeSelectView } from './RangeSelect.view'

const meta: Meta<typeof RangeSelectView> = {
  title: 'Pages/Exam/RangeSelect',
  component: RangeSelectView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RangeSelectView>

export const Esuken4: Story = {
  args: {
    category: 'esuken4',
    total: 500,
    rangeOptions10: Array.from({ length: 10 }, (_, i) => ({
      start: i * 10 + 1,
      size: 10,
    })),
    rangeOptions100: Array.from({ length: 5 }, (_, i) => ({
      start: i * 100 + 1,
      size: 100,
    })),
    categoryEmoji: '🏆',
    categoryName: 'エス検4級',
    onSelectRange: (start: number, size: number) => console.log('Select range:', start, size),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const SmallDataset: Story = {
  args: {
    category: 'custom',
    total: 50,
    rangeOptions10: Array.from({ length: 5 }, (_, i) => ({
      start: i * 10 + 1,
      size: 10,
    })),
    rangeOptions100: [{ start: 1, size: 100 }],
    categoryEmoji: '📚',
    categoryName: 'カスタム学習',
    onSelectRange: (start: number, size: number) => console.log('Select range:', start, size),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const LargeDataset: Story = {
  args: {
    category: 'esuken3',
    total: 1000,
    rangeOptions10: Array.from({ length: 20 }, (_, i) => ({
      start: i * 10 + 1,
      size: 10,
    })),
    rangeOptions100: Array.from({ length: 10 }, (_, i) => ({
      start: i * 100 + 1,
      size: 100,
    })),
    categoryEmoji: '🥇',
    categoryName: 'エス検3級',
    onSelectRange: (start: number, size: number) => console.log('Select range:', start, size),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}