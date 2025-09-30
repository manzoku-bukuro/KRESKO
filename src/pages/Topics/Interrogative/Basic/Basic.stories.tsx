import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../../contexts/AuthContext'
import { Basic } from './Basic'

const meta: Meta<typeof Basic> = {
  title: 'Pages/Topics/Interrogative/Basic',
  component: Basic,
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
type Story = StoryObj<typeof Basic>

export const Default: Story = {}