import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Advanced } from './Advanced'

const meta: Meta<typeof Advanced> = {
  title: 'Pages/Topics/Interrogative/Advanced',
  component: Advanced,
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
type Story = StoryObj<typeof Advanced>

export const Default: Story = {}