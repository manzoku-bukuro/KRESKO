import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { MenuView } from './Menu.view'

const meta: Meta<typeof MenuView> = {
  title: 'Pages/Topics/Interrogative/Menu',
  component: MenuView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MenuView>

export const Default: Story = {
  args: {
    onNavigateToExplanation: () => console.log('Navigate to Explanation'),
    onNavigateToBasic: () => console.log('Navigate to Basic'),
    onNavigateToAdvanced: () => console.log('Navigate to Advanced'),
    onNavigateToTop: () => console.log('Navigate to Top'),
  },
}