import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../contexts/AuthContext'
import { Quiz } from './Quiz'

const meta: Meta<typeof Quiz> = {
  title: 'Pages/Exam/Quiz',
  component: Quiz,
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
type Story = StoryObj<typeof Quiz>

export const Default: Story = {
  parameters: {
    reactRouter: {
      routePath: '/quiz/:category/:rangeStart/:rangeSize',
      routeParams: { category: 'esuken4', rangeStart: '1', rangeSize: '10' },
    },
  },
}