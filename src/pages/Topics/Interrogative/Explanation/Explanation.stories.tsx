import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { ExplanationView } from './Explanation.view'
import { interrogatives } from './data/interrogatives'

const meta: Meta<typeof ExplanationView> = {
  title: 'Pages/Topics/Interrogative/Explanation',
  component: ExplanationView,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ExplanationView>

export const Default: Story = {
  args: {
    interrogatives,
    onNavigateToBasic: () => console.log('Navigate to Basic'),
    onNavigateToAdvanced: () => console.log('Navigate to Advanced'),
    onNavigateToMenu: () => console.log('Navigate to Menu'),
  },
}

export const Limited: Story = {
  args: {
    interrogatives: interrogatives.slice(0, 3),
    onNavigateToBasic: () => console.log('Navigate to Basic'),
    onNavigateToAdvanced: () => console.log('Navigate to Advanced'),
    onNavigateToMenu: () => console.log('Navigate to Menu'),
  },
}