import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignupForm } from './SignupForm'
import * as useSignupFormModule from './hooks/useSignupForm'

// Mock the view component
vi.mock('./SignupForm.view', () => ({
  SignupFormView: ({ state }: { state: { loading: boolean; error: string } }) => (
    <div data-testid="signup-form">
      <div data-testid="loading">{state.loading ? 'loading' : 'idle'}</div>
      {state.error && <div data-testid="error">{state.error}</div>}
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useSignupForm', () => ({
  useSignupForm: vi.fn(() => ({
    state: {
      formData: { email: '', password: '', confirmPassword: '' },
      loading: false,
      error: '',
    },
    actions: {
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleGoogleSignup: vi.fn(),
    },
  })),
}))

const mockedUseSignupForm = vi.mocked(useSignupFormModule.useSignupForm)

describe('SignupForm', () => {
  it('renders correctly', () => {
    render(<SignupForm />)
    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
  })

  it('renders with loading state', () => {
    mockedUseSignupForm.mockReturnValue({
      state: {
        formData: { email: '', password: '', confirmPassword: '' },
        loading: true,
        error: '',
      },
      actions: {
        handleChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleGoogleSignup: vi.fn(),
      },
    })

    render(<SignupForm />)
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('renders with error message', () => {
    mockedUseSignupForm.mockReturnValue({
      state: {
        formData: { email: '', password: '', confirmPassword: '' },
        loading: false,
        error: 'Signup failed',
      },
      actions: {
        handleChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleGoogleSignup: vi.fn(),
      },
    })

    render(<SignupForm />)
    expect(screen.getByTestId('error')).toHaveTextContent('Signup failed')
  })

  it('passes onSuccess to hook', () => {
    const onSuccess = vi.fn()

    render(<SignupForm onSuccess={onSuccess} />)

    expect(mockedUseSignupForm).toHaveBeenCalledWith({ onSuccess })
  })
})
