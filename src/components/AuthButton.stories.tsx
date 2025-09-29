import type { Meta, StoryObj } from '@storybook/react'
import AuthButton from './AuthButton'
import { AuthProvider } from '../contexts/AuthContext'

// Mock user data
const mockUser = {
  email: 'test@example.com',
  uid: '123',
}

// Mock AuthProvider for stories
const MockAuthProvider = ({ children, user = null }: { children: React.ReactNode, user?: any }) => {
  const mockValue = {
    user,
    signInWithEmailPassword: async () => {},
    signUpWithEmailPassword: async () => {},
    signInWithGoogle: async () => {},
    signOutHandler: async () => {},
    loading: false
  }

  return (
    <div style={{
      '--color-bg': '#fdfdfd',
      '--color-text': '#333',
      '--color-primary': '#58cc02',
      '--color-primary-dark': '#46a302',
      '--color-border': '#e0e0e0',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#f8f9fa',
      '--color-muted': '#555',
      '--spacing-sm': '8px',
      '--spacing-md': '16px',
      '--spacing-lg': '24px',
      '--radius-lg': '16px',
      '--font-weight-medium': '500',
      '--font-weight-semibold': '600',
      '--transition-fast': '0.15s ease'
    } as React.CSSProperties}>
      <AuthProvider value={mockValue as any}>
        {children}
      </AuthProvider>
    </div>
  )
}

const meta: Meta<typeof AuthButton> = {
  title: 'Components/AuthButton',
  component: AuthButton,
  decorators: [
    (Story, { args }) => (
      <MockAuthProvider user={(args as any).user}>
        <div style={{ padding: '20px', background: 'var(--color-bg)' }}>
          <Story />
        </div>
      </MockAuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AuthButton>

export const NotLoggedIn: Story = {
  args: {
    user: null,
  },
}

export const LoggedIn: Story = {
  args: {
    user: mockUser,
  },
}