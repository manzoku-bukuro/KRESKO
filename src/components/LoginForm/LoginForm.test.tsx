import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginForm } from './LoginForm'
import * as useLoginFormModule from './hooks/useLoginForm'

// Mock the view component
vi.mock('./LoginForm.view', () => ({
  LoginFormView: ({ state }: { state: { loading: boolean; error: string } }) => (
    <div data-testid="login-form">
      <div data-testid="loading">{state.loading ? 'loading' : 'idle'}</div>
      {state.error && <div data-testid="error">{state.error}</div>}
    </div>
  ),
}))

// Mock the hook
vi.mock('./hooks/useLoginForm', () => ({
  useLoginForm: vi.fn(() => ({
    state: {
      formData: { email: '', password: '' },
      loading: false,
      error: '',
    },
    actions: {
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleGoogleLogin: vi.fn(),
    },
  })),
}))

const mockedUseLoginForm = vi.mocked(useLoginFormModule.useLoginForm)

describe('LoginForm', () => {
  it('renders correctly', () => {
    render(<LoginForm />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('renders with loading state', () => {
    mockedUseLoginForm.mockReturnValue({
      state: {
        formData: { email: '', password: '' },
        loading: true,
        error: '',
      },
      actions: {
        handleChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleGoogleLogin: vi.fn(),
      },
    })

    render(<LoginForm />)
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('renders with error message', () => {
    mockedUseLoginForm.mockReturnValue({
      state: {
        formData: { email: '', password: '' },
        loading: false,
        error: 'Login failed',
      },
      actions: {
        handleChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleGoogleLogin: vi.fn(),
      },
    })

    render(<LoginForm />)
    expect(screen.getByTestId('error')).toHaveTextContent('Login failed')
  })

  it('passes onSuccess to hook', () => {
    const onSuccess = vi.fn()

    render(<LoginForm onSuccess={onSuccess} />)

    expect(mockedUseLoginForm).toHaveBeenCalledWith({ onSuccess })
  })
})
