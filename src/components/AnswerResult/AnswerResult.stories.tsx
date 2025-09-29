import type { Meta, StoryObj } from '@storybook/react'
import { AnswerResult } from './AnswerResult'

const meta: Meta<typeof AnswerResult> = {
  title: 'Components/AnswerResult',
  component: AnswerResult,
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
type Story = StoryObj<typeof AnswerResult>

export const TraditionalMode: Story = {
  args: {
    variant: 'traditional',
    isVisible: true,
    wordDisplay: {
      primary: 'saluton',
      secondary: 'こんにちは',
      extra: 'エスペラント語の一般的な挨拶'
    }
  },
}

export const ChoiceCorrect: Story = {
  args: {
    variant: 'choice',
    resultType: 'correct',
    isVisible: true,
    message: '🎉 正解です！',
    wordDisplay: {
      extra: '詳しい解説：この疑問詞は「何」を意味します。'
    },
    nextButtonText: '次の問題へ',
    onNext: () => console.log('Next clicked')
  },
}

export const ChoiceWrong: Story = {
  args: {
    variant: 'choice',
    resultType: 'wrong',
    isVisible: true,
    message: '❌ 不正解です',
    wordDisplay: {
      extra: '正解は「誰」でした。再度復習しましょう。'
    },
    nextButtonText: '次の問題へ',
    onNext: () => console.log('Next clicked')
  },
}

export const GameCorrect: Story = {
  args: {
    variant: 'game',
    resultType: 'correct',
    isVisible: true,
    message: '🎉 正解です！素晴らしい！',
  },
}

export const GameWrong: Story = {
  args: {
    variant: 'game',
    resultType: 'wrong',
    isVisible: true,
    message: '正解は: mil naŭcent naŭdek naŭ',
  },
}

export const Hidden: Story = {
  args: {
    variant: 'choice',
    resultType: 'correct',
    isVisible: false,
    message: 'このメッセージは表示されません',
  },
}