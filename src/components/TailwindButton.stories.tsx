import type { Meta, StoryObj } from '@storybook/react'

// Tailwindで新しく作成するButtonコンポーネント
const TailwindButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}) => {
  const baseClasses = 'inline-flex items-center justify-content font-main font-semibold border-0 cursor-pointer no-underline transition-all select-none relative overflow-hidden touch-manipulation focus:outline-none focus:outline-2 focus:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none'

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-soft focus:outline-primary',
    secondary: 'bg-surface text-text border-2 border-border hover:bg-surface-hover hover:border-primary hover:-translate-y-px',
    accent: 'bg-accent text-white hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-soft',
    danger: 'bg-danger text-white hover:bg-danger-dark hover:-translate-y-0.5 hover:shadow-soft'
  }

  const sizeClasses = {
    sm: 'px-md py-sm text-sm min-h-9 duration-fast',
    md: 'px-lg py-md text-base min-h-11 duration-fast m-sm rounded-lg',
    lg: 'px-2xl py-lg text-lg min-h-12 duration-fast'
  }

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`

  return (
    <button className={className} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

const meta: Meta<typeof TailwindButton> = {
  title: 'Components/TailwindButton',
  component: TailwindButton,
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
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof TailwindButton>

export const Primary: Story = {
  args: {
    children: 'プライマリボタン',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'セカンダリボタン',
    variant: 'secondary',
  },
}

export const Accent: Story = {
  args: {
    children: 'アクセントボタン',
    variant: 'accent',
  },
}

export const Danger: Story = {
  args: {
    children: '危険ボタン',
    variant: 'danger',
  },
}

export const Large: Story = {
  args: {
    children: '大きなボタン',
    variant: 'primary',
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    children: '小さなボタン',
    variant: 'primary',
    size: 'sm',
  },
}

export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    variant: 'primary',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <>
      <TailwindButton variant="primary">プライマリ</TailwindButton>
      <TailwindButton variant="secondary">セカンダリ</TailwindButton>
      <TailwindButton variant="accent">アクセント</TailwindButton>
      <TailwindButton variant="danger">危険</TailwindButton>
      <TailwindButton variant="primary" size="lg">大きい</TailwindButton>
      <TailwindButton variant="primary" size="sm">小さい</TailwindButton>
      <TailwindButton variant="primary" disabled>無効</TailwindButton>
    </>
  ),
}