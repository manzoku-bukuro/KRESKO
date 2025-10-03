import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthButton } from './AuthButton'
import * as useAuthButtonModule from './hooks/useAuthButton'

// Mock the view component
vi.mock('./AuthButton.view', () => ({
  AuthButtonView: ({ data }: { data: { user: unknown } }) => (
    <div data-testid="auth-button">
      <div data-testid="user-state">{data.user ? 'logged-in' : 'logged-out'}</div>
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useAuthButton', () => ({
  useAuthButton: vi.fn(() => ({
    data: {
      user: null,
      showAuthModal: false,
      authMode: 'login',
      loading: false,
    },
    actions: {
      handleSignOut: vi.fn(),
      openLoginModal: vi.fn(),
      openSignupModal: vi.fn(),
      closeAuthModal: vi.fn(),
    },
  })),
}))

const mockedUseAuthButton = vi.mocked(useAuthButtonModule.useAuthButton)

describe('AuthButton', () => {
  it('renders correctly', () => {
    render(<AuthButton />)
    expect(screen.getByTestId('auth-button')).toBeInTheDocument()
  })

  it('renders when user is logged out', () => {
    render(<AuthButton />)
    expect(screen.getByTestId('user-state')).toHaveTextContent('logged-out')
  })

  it('renders when user is logged in', () => {
    mockedUseAuthButton.mockReturnValue({
      data: {
        user: { uid: '123', email: 'test@example.com' } as unknown as import('firebase/auth').User,
        showAuthModal: false,
        authMode: 'login',
        loading: false,
      },
      actions: {
        handleSignOut: vi.fn(),
        openLoginModal: vi.fn(),
        openSignupModal: vi.fn(),
        closeAuthModal: vi.fn(),
      },
    })

    render(<AuthButton />)
    expect(screen.getByTestId('user-state')).toHaveTextContent('logged-in')
  })
})
