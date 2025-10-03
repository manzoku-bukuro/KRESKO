import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../contexts/AuthContext'
import { ListView } from './List.view'
import type { WeakQuestion } from '../../../utils/firestore'
import { createMockUser } from '../../../test/mockHelpers'

const meta: Meta<typeof ListView> = {
  title: 'Pages/SavedQuestions/List',
  component: ListView,
  decorators: [
    (Story) => (
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ListView>

const mockWeakQuestions: WeakQuestion[] = [
  {
    esperanto: 'kato',
    japanese: '猫',
    extra: '動物',
    addedAt: new Date('2025-01-01'),
    incorrectCount: 3,
  },
  {
    esperanto: 'hundo',
    japanese: '犬',
    addedAt: new Date('2025-01-02'),
    incorrectCount: 1,
  },
  {
    esperanto: 'birdo',
    japanese: '鳥',
    addedAt: new Date('2025-01-03'),
    incorrectCount: 5,
  },
]

export const NotAuthenticated: Story = {
  args: {
    user: null,
    loading: false,
    weakQuestions: [],
    onRemoveQuestion: async (esperanto: string) => console.log('Remove:', esperanto),
    onNavigateToReview: () => console.log('Navigate to Review'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const Loading: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: true,
    weakQuestions: [],
    onRemoveQuestion: async (esperanto: string) => console.log('Remove:', esperanto),
    onNavigateToReview: () => console.log('Navigate to Review'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const EmptyList: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: false,
    weakQuestions: [],
    onRemoveQuestion: async (esperanto: string) => console.log('Remove:', esperanto),
    onNavigateToReview: () => console.log('Navigate to Review'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}

export const WithQuestions: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: false,
    weakQuestions: mockWeakQuestions,
    onRemoveQuestion: async (esperanto: string) => console.log('Remove:', esperanto),
    onNavigateToReview: () => console.log('Navigate to Review'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  }
}