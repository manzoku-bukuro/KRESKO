import type { Meta, StoryObj } from '@storybook/react'
import { WordList } from './WordList'

const meta: Meta<typeof WordList> = {
  title: 'Components/WordList',
  component: WordList,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minHeight: '400px', background: '#f0f0f0' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof WordList>

export const Quiz: Story = {
  args: {
    title: '学習した単語一覧',
    words: [
      {
        primary: 'saluton',
        secondary: 'こんにちは',
        extra: 'エスペラント語の一般的な挨拶'
      },
      {
        primary: 'dankon',
        secondary: 'ありがとう',
        extra: '感謝を表す基本的な表現'
      },
      {
        primary: 'bona',
        secondary: '良い',
        isIncorrect: true,
        incorrectLabel: '❌ 間違い'
      },
      {
        primary: 'malbona',
        secondary: '悪い'
      }
    ]
  }
}

export const InterrogativeBasic: Story = {
  args: {
    title: '学習した疑問詞一覧',
    words: [
      {
        primary: 'kio',
        secondary: '何'
      },
      {
        primary: 'kiu',
        secondary: '誰'
      },
      {
        primary: 'kie',
        secondary: 'どこで'
      },
      {
        primary: 'kiam',
        secondary: 'いつ'
      }
    ]
  }
}

export const InterrogativeAdvanced: Story = {
  args: {
    title: '学習した問題一覧',
    words: [
      {
        primary: 'Mi vidas _____ hundon en la parko.',
        secondary: '私は公園で犬を見ています。'
      },
      {
        primary: '_____ estas via nomo?',
        secondary: 'あなたの名前は何ですか？'
      },
      {
        primary: 'Li demandas _____ vi loĝas.',
        secondary: '彼はあなたがどこに住んでいるか尋ねています。'
      }
    ]
  }
}

export const WeakQuestionsReview: Story = {
  args: {
    title: '理解できた問題一覧',
    words: [
      {
        primary: 'libro',
        secondary: '本'
      },
      {
        primary: 'domo',
        secondary: '家'
      },
      {
        primary: 'akvo',
        secondary: '水'
      }
    ]
  }
}

export const Empty: Story = {
  args: {
    title: '学習した単語一覧',
    words: []
  }
}

export const LongList: Story = {
  args: {
    title: '大量の単語一覧',
    words: Array.from({ length: 20 }, (_, idx) => ({
      primary: `word${idx + 1}`,
      secondary: `意味${idx + 1}`,
      extra: idx % 3 === 0 ? `追加情報${idx + 1}` : undefined,
      isIncorrect: idx % 5 === 0,
      incorrectLabel: idx % 5 === 0 ? '❌ 間違い' : undefined
    }))
  }
}