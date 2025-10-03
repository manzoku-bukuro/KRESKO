import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReviewView } from './Review.view'
import type { WeakQuestion } from '@/utils/firestore'
import type { QuizQuestion } from '@/types'
import { createMockUser } from '@/test/mockHelpers'

const meta: Meta<typeof ReviewView> = {
  title: 'Pages/SavedQuestions/Review',
  component: ReviewView,
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
type Story = StoryObj<typeof ReviewView>

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
]

const mockQuizQuestions: QuizQuestion[] = [
  {
    esperanto: 'kato',
    japanese: '猫',
    extra: '動物',
  },
  {
    esperanto: 'hundo',
    japanese: '犬',
  },
]

export const EmptyState: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: false,
    error: null,
    allWeakQuestions: [],
    quizQuestions: [],
    onUnderstood: async (question: QuizQuestion) => console.log('Understood:', question),
    onNavigateToTop: () => console.log('Navigate to Top'),
    onNavigateToList: () => console.log('Navigate to List'),
  }
}

export const Loading: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: true,
    error: null,
    allWeakQuestions: mockWeakQuestions,
    quizQuestions: mockQuizQuestions,
    onUnderstood: async (question: QuizQuestion) => console.log('Understood:', question),
    onNavigateToTop: () => console.log('Navigate to Top'),
    onNavigateToList: () => console.log('Navigate to List'),
  }
}

export const WithError: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: false,
    error: 'ネットワークエラーが発生しました',
    allWeakQuestions: [],
    quizQuestions: [],
    onUnderstood: async (question: QuizQuestion) => console.log('Understood:', question),
    onNavigateToTop: () => console.log('Navigate to Top'),
    onNavigateToList: () => console.log('Navigate to List'),
  }
}

export const WithQuestions: Story = {
  args: {
    user: createMockUser({ uid: 'test-user' }),
    loading: false,
    error: null,
    allWeakQuestions: mockWeakQuestions,
    quizQuestions: mockQuizQuestions,
    onUnderstood: async (question: QuizQuestion) => console.log('Understood:', question),
    onNavigateToTop: () => console.log('Navigate to Top'),
    onNavigateToList: () => console.log('Navigate to List'),
  }
}