import { SignupForm } from '../SignupForm'
import { LoginForm } from '../LoginForm'
import type { AuthModalViewProps } from './AuthModal.types'

export const AuthModalView = ({
  isOpen,
  mode,
  onClose,
  onOverlayClick,
  onSuccess,
  onSwitchToLogin,
  onSwitchToSignup,
}: AuthModalViewProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {mode === 'signup' ? (
          <SignupForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />
        ) : (
          <LoginForm onSuccess={onSuccess} onSwitchToSignup={onSwitchToSignup} />
        )}
      </div>
    </div>
  )
}