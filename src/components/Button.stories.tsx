import type { Meta, StoryObj } from '@storybook/react'

// Button component is not a separate component but uses CSS classes
const Button = ({ children, className = '', ...props }: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}) => (
  <button className={`btn ${className}`} {...props}>
    {children}
  </button>
)

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'ボタン',
    },
    className: {
      control: 'select',
      options: ['', 'btn-primary', 'btn-secondary', 'btn-accent', 'btn-danger', 'btn-large', 'btn-small', 'btn-full'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'プライマリボタン',
    className: 'btn-primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'セカンダリボタン',
    className: 'btn-secondary',
  },
}

export const Accent: Story = {
  args: {
    children: 'アクセントボタン',
    className: 'btn-accent',
  },
}

export const Danger: Story = {
  args: {
    children: '危険ボタン',
    className: 'btn-danger',
  },
}

export const Large: Story = {
  args: {
    children: '大きなボタン',
    className: 'btn-primary btn-large',
  },
}

export const Small: Story = {
  args: {
    children: '小さなボタン',
    className: 'btn-primary btn-small',
  },
}

export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    className: 'btn-primary',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <>
      <Button className="btn-primary">プライマリ</Button>
      <Button className="btn-secondary">セカンダリ</Button>
      <Button className="btn-accent">アクセント</Button>
      <Button className="btn-danger">危険</Button>
      <Button className="btn-primary btn-large">大きい</Button>
      <Button className="btn-primary btn-small">小さい</Button>
      <Button className="btn-primary" disabled>無効</Button>
    </>
  ),
}