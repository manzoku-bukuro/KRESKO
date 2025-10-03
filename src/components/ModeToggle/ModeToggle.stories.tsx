import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ModeToggle } from './ModeToggle'
import type { QuizMode } from '@/types'

const meta: Meta<typeof ModeToggle> = {
  title: 'Components/ModeToggle',
  component: ModeToggle,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minHeight: '200px', background: '#f0f0f0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ModeToggle>

export const TraditionalMode: Story = {
  args: {
    currentMode: 'traditional',
    onModeChange: (mode: QuizMode) => console.log('Mode changed to:', mode)
  }
}

export const MultipleChoiceMode: Story = {
  args: {
    currentMode: 'multiple-choice',
    onModeChange: (mode: QuizMode) => console.log('Mode changed to:', mode)
  }
}

export const CustomLabels: Story = {
  args: {
    currentMode: 'traditional',
    traditionalLabel: '📖 読み取り',
    multipleChoiceLabel: '🎯 選択肢',
    onModeChange: (mode: QuizMode) => console.log('Mode changed to:', mode)
  }
}

// インタラクティブなストーリー
export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<QuizMode>('traditional')

    return (
      <div>
        <ModeToggle
          currentMode={mode}
          onModeChange={setMode}
        />
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          現在のモード: <strong>{mode}</strong>
        </p>
      </div>
    )
  }
}

export const WithCustomClass: Story = {
  args: {
    currentMode: 'multiple-choice',
    className: 'mt-xl',
    onModeChange: (mode: QuizMode) => console.log('Mode changed to:', mode)
  }
}