import { LogIn, LogOut, UserCircle } from 'lucide-react'
import AuthModal from '../AuthModal'
import type { AuthButtonData, AuthButtonActions } from './hooks/useAuthButton'

interface AuthButtonViewProps {
  data: AuthButtonData
  actions: AuthButtonActions
}

export const AuthButtonView = ({ data, actions }: AuthButtonViewProps) => {
  const { user, showAuthModal, authMode, loading } = data
  const { handleSignOut, openLoginModal, closeAuthModal } = actions

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          読み込み中...
        </span>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={openLoginModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            height: '2.25rem',
            padding: '0 0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <LogIn style={{ width: '1rem', height: '1rem' }} />
          <span>ログイン</span>
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={closeAuthModal}
          defaultMode={authMode}
        />
      </>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          height: '2.25rem',
          padding: '0 0.625rem',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: '0.375rem',
          border: '1px solid var(--color-border)',
          maxWidth: '140px',
        }}
      >
        <UserCircle style={{ width: '1rem', height: '1rem', color: 'var(--color-text)', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.email}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '2.25rem',
          width: '2.25rem',
          padding: 0,
          backgroundColor: 'var(--color-surface-hover)',
          color: 'var(--color-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-border)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        aria-label="ログアウト"
      >
        <LogOut style={{ width: '1rem', height: '1rem' }} />
      </button>
    </div>
  )
}
