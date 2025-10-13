import { X } from 'lucide-react'
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
    <div
      onClick={onOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '0.75rem',
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          animation: 'slideUp 0.15s ease',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            transition: 'color 0.15s ease',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 1,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--color-text)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--color-muted)'
          }}
          aria-label="閉じる"
        >
          <X style={{ width: '20px', height: '20px' }} />
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
