import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './Footer'
import { FooterView } from './Footer.view'
import type { FooterData } from '.'

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {}

export const WithDifferentViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// FooterView専用のストーリー（separate export）

type ViewStory = StoryObj<typeof FooterView>

const defaultData: FooterData = {
  links: {
    privacy: {
      text: 'プライバシーポリシー',
      to: '/privacy-policy'
    },
    github: {
      text: 'GitHub',
      href: 'https://github.com/manzoku-bukuro/MEMORU',
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  },
  copyright: '© 2025 MEMORU. All rights reserved.'
}

export const ViewDefault: ViewStory = {
  args: {
    data: defaultData
  }
}

export const ViewCustom: ViewStory = {
  args: {
    data: {
      links: {
        privacy: {
          text: 'カスタムプライバシー',
          to: '/custom-privacy'
        },
        github: {
          text: 'カスタムGitHub',
          href: 'https://custom.com',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      },
      copyright: '© 2025 カスタムアプリ. All rights reserved.'
    }
  }
}