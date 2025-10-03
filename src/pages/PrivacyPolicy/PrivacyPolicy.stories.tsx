import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { PrivacyPolicyView } from './PrivacyPolicy.view'

const meta: Meta<typeof PrivacyPolicyView> = {
  title: 'Pages/PrivacyPolicy',
  component: PrivacyPolicyView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PrivacyPolicyView>

export const Default: Story = {
  args: {
    onBack: () => console.log('Navigate to Top'),
  }
}