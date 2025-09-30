import { AuthModalView } from './AuthModal.view'
import { useAuthModal } from './hooks/useAuthModal'
import type { AuthModalProps } from './AuthModal.types'

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const { mode, switchToLogin, switchToSignup } = useAuthModal(defaultMode)

  const handleSuccess = () => {
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AuthModalView
      isOpen={isOpen}
      mode={mode}
      onClose={onClose}
      onOverlayClick={handleOverlayClick}
      onSuccess={handleSuccess}
      onSwitchToLogin={switchToLogin}
      onSwitchToSignup={switchToSignup}
    />
  )
}

export default AuthModal