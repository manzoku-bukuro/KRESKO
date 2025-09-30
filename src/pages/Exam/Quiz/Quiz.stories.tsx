import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../contexts/AuthContext'
import { QuizView } from './Quiz.view'
import type { QuizViewProps } from './Quiz.types'

const meta: Meta<typeof QuizView> = {
  title: 'Pages/Exam/Quiz',
  component: QuizView,
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
type Story = StoryObj<typeof QuizView>

const mockQuestions = Array(10)
  .fill(null)
  .map((_, i) => ({
    esperanto: `vorto${i + 1}`,
    japanese: `単語${i + 1}`,
  }))

const defaultArgs: QuizViewProps = {
  dataError: null,
  quizQuestions: mockQuestions,
  categoryEmoji: '🏆',
  categoryName: 'エス検4級',
  rangeStart: '1',
  rangeSize: '10',
  category: 'esuken4',
  wordsLength: 500,
  isAuthenticated: true,
  onMarkAsWeak: async () => console.log('Mark as weak'),
  onNextRange: () => console.log('Next range'),
  onNavigateToRange: () => console.log('Navigate to range'),
  onNavigateToTop: () => console.log('Navigate to top'),
  onGenerateCustomChoices: () => ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
}

export const Default: Story = {
  args: defaultArgs,
}

export const WithError: Story = {
  args: {
    ...defaultArgs,
    dataError: 'データの読み込みに失敗しました',
    quizQuestions: [],
  },
}

export const NotAuthenticated: Story = {
  args: {
    ...defaultArgs,
    isAuthenticated: false,
  },
}