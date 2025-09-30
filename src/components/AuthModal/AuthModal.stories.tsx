import type { Meta, StoryObj } from '@storybook/react'
import { AuthModalView } from './AuthModal.view'
import type { AuthModalViewProps } from './AuthModal.types'

const meta: Meta<typeof AuthModalView> = {
  title: 'Components/AuthModal',
  component: AuthModalView,
}

export default meta
type Story = StoryObj<typeof AuthModalView>

const defaultArgs: AuthModalViewProps = {
  isOpen: true,
  mode: 'login',
  onClose: () => console.log('Close modal'),
  onOverlayClick: () => console.log('Overlay clicked'),
  onSuccess: () => console.log('Success'),
  onSwitchToLogin: () => console.log('Switch to login'),
  onSwitchToSignup: () => console.log('Switch to signup'),
}

export const LoginMode: Story = {
  args: defaultArgs,
}

export const SignupMode: Story = {
  args: {
    ...defaultArgs,
    mode: 'signup',
  },
}

export const Closed: Story = {
  args: {
    ...defaultArgs,
    isOpen: false,
  },
}