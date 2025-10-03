import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthModal } from './AuthModal'

// Mock child components
vi.mock('../SignupForm', () => ({
  SignupForm: ({ onSuccess, onSwitchToLogin }: { onSuccess?: () => void; onSwitchToLogin?: () => void }) => (
    <div>
      <h2>Signup Form</h2>
      <button onClick={onSuccess}>Submit Signup</button>
      <button onClick={onSwitchToLogin}>Switch to Login</button>
    </div>
  ),
}))

vi.mock('../LoginForm', () => ({
  LoginForm: ({ onSuccess, onSwitchToSignup }: { onSuccess?: () => void; onSwitchToSignup?: () => void }) => (
    <div>
      <h2>Login Form</h2>
      <button onClick={onSuccess}>Submit Login</button>
      <button onClick={onSwitchToSignup}>Switch to Signup</button>
    </div>
  ),
}))

describe('AuthModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders login form by default', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })

  it('renders signup form when defaultMode is signup', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} defaultMode="signup" />)
    expect(screen.getByText('Signup Form')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('×')).toBeInTheDocument()
  })
})