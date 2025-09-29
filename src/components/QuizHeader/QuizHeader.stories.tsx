import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { QuizHeader } from './QuizHeader'

const meta: Meta<typeof QuizHeader> = {
  title: 'Components/QuizHeader',
  component: QuizHeader,
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
type Story = StoryObj<typeof QuizHeader>

export const BasicQuiz: Story = {
  args: {
    title: 'エス研4 単語学習',
    currentQuestion: 3,
    totalQuestions: 10,
  }
}

export const WithSubtitle: Story = {
  args: {
    title: '疑問詞 - 基本学習',
    currentQuestion: 5,
    totalQuestions: 8,
    subtitle: '疑問詞の意味を覚える練習問題'
  }
}

export const WithModeToggle: Story = {
  args: {
    title: '苦手問題復習',
    currentQuestion: 2,
    totalQuestions: 15,
    showModeToggle: true,
    modeToggleProps: {
      currentMode: 'traditional',
      onModeChange: (mode) => console.log('Mode changed to:', mode)
    }
  }
}

export const InteractiveWithModeToggle: Story = {
  render: () => {
    const [mode, setMode] = useState<'traditional' | 'multiple-choice'>('multiple-choice')
    const [currentQuestion, setCurrentQuestion] = useState(1)

    return (
      <div>
        <QuizHeader
          title="インタラクティブクイズ"
          currentQuestion={currentQuestion}
          totalQuestions={20}
          subtitle="モード切り替えと進捗が確認できます"
          showModeToggle={true}
          modeToggleProps={{
            currentMode: mode,
            onModeChange: setMode
          }}
        />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
            style={{ marginRight: '10px' }}
          >
            ← 前の問題
          </button>
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(20, prev + 1))}
          >
            次の問題 →
          </button>
        </div>
      </div>
    )
  }
}

export const LongProgress: Story = {
  args: {
    title: '大規模テスト',
    currentQuestion: 847,
    totalQuestions: 1000,
    subtitle: '長い進捗表示のテスト'
  }
}