import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ChoiceButtons } from './ChoiceButtons'

const meta: Meta<typeof ChoiceButtons> = {
  title: 'Components/ChoiceButtons',
  component: ChoiceButtons,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minHeight: '300px', background: '#f0f0f0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ChoiceButtons>

export const BeforeSelection: Story = {
  args: {
    choices: ['こんにちは', 'ありがとう', 'さようなら', 'おはよう'],
    showResult: false,
    onChoiceClick: (choice: string) => console.log('Selected:', choice),
    instruction: 'この単語の意味を選んでください'
  }
}

export const AfterCorrectSelection: Story = {
  args: {
    choices: ['こんにちは', 'ありがとう', 'さようなら', 'おはよう'],
    selectedAnswer: 'こんにちは',
    correctAnswer: 'こんにちは',
    showResult: true,
    onChoiceClick: (choice: string) => console.log('Selected:', choice)
  }
}

export const AfterWrongSelection: Story = {
  args: {
    choices: ['こんにちは', 'ありがとう', 'さようなら', 'おはよう'],
    selectedAnswer: 'ありがとう',
    correctAnswer: 'こんにちは',
    showResult: true,
    onChoiceClick: (choice: string) => console.log('Selected:', choice)
  }
}

export const Loading: Story = {
  args: {
    choices: [],
    showResult: false,
    onChoiceClick: (choice: string) => console.log('Selected:', choice),
    loadingMessage: '選択肢を生成中...'
  }
}

export const CustomInstruction: Story = {
  args: {
    choices: ['kio', 'kiu', 'kie', 'kiam'],
    showResult: false,
    onChoiceClick: (choice: string) => console.log('Selected:', choice),
    instruction: 'エスペラント語で「何」を意味する疑問詞はどれですか？'
  }
}

// インタラクティブなストーリー
export const Interactive: Story = {
  render: () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const choices = ['こんにちは', 'ありがとう', 'さようなら', 'おはよう']
    const correctAnswer = 'こんにちは'

    const handleChoiceClick = (choice: string) => {
      if (selectedAnswer) return
      setSelectedAnswer(choice)
      setShowResult(true)
    }

    const reset = () => {
      setSelectedAnswer(null)
      setShowResult(false)
    }

    return (
      <div>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
          「saluton」の意味は？
        </h3>
        <ChoiceButtons
          choices={choices}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          showResult={showResult}
          onChoiceClick={handleChoiceClick}
          instruction="正しい答えを選んでください"
        />
        {showResult && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>
              {selectedAnswer === correctAnswer ? '🎉 正解です！' : '❌ 不正解です'}
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              リセット
            </button>
          </div>
        )}
      </div>
    )
  }
}

export const LongChoices: Story = {
  args: {
    choices: [
      'とても長い選択肢のテキストでレイアウトを確認します',
      '短い選択肢',
      '中くらいの長さの選択肢です',
      'もう一つの非常に長い選択肢でボタンの高さの調整を確認'
    ],
    showResult: false,
    onChoiceClick: (choice: string) => console.log('Selected:', choice)
  }
}