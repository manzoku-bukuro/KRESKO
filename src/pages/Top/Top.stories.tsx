import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { TopView } from './Top.view'

const meta: Meta<typeof TopView> = {
  title: 'Pages/Top',
  component: TopView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TopView>

export const Default: Story = {
  args: {
    weakQuestionsCount: 0,
    isAuthenticated: false,
    onNavigateToExam: () => console.log('Navigate to Exam'),
    onNavigateToInterrogative: () => console.log('Navigate to Interrogative'),
    onNavigateToNumberGame: () => console.log('Navigate to Number Game'),
    onNavigateToWeakQuestions: () => console.log('Navigate to Weak Questions'),
  }
}

export const WithWeakQuestions: Story = {
  args: {
    weakQuestionsCount: 15,
    isAuthenticated: true,
    onNavigateToExam: () => console.log('Navigate to Exam'),
    onNavigateToInterrogative: () => console.log('Navigate to Interrogative'),
    onNavigateToNumberGame: () => console.log('Navigate to Number Game'),
    onNavigateToWeakQuestions: () => console.log('Navigate to Weak Questions'),
  }
}

export const Authenticated: Story = {
  args: {
    weakQuestionsCount: 0,
    isAuthenticated: true,
    onNavigateToExam: () => console.log('Navigate to Exam'),
    onNavigateToInterrogative: () => console.log('Navigate to Interrogative'),
    onNavigateToNumberGame: () => console.log('Navigate to Number Game'),
    onNavigateToWeakQuestions: () => console.log('Navigate to Weak Questions'),
  }
}