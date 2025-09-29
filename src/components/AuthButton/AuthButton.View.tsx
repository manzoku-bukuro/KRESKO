import AuthModal from '../AuthModal'
import type { AuthButtonData, AuthButtonActions } from './hooks/useAuthButton'

interface AuthButtonViewProps {
  data: AuthButtonData
  actions: AuthButtonActions
}

export const AuthButtonView = ({ data, actions }: AuthButtonViewProps) => {
  const { user, showAuthModal, authMode, loading } = data
  const { handleSignOut, openLoginModal, openSignupModal, closeAuthModal } = actions

  if (loading) {
    return (
      <div className="auth-status">
        <span className="user-info">読み込み中...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="auth-buttons">
          <button
            className="btn btn-primary"
            onClick={openSignupModal}
          >
            👤 新規登録
          </button>
          <button
            className="btn btn-secondary"
            onClick={openLoginModal}
          >
            🔑 ログイン
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={closeAuthModal}
          defaultMode={authMode}
        />
      </>
    )
  }

  return (
    <div className="auth-status">
      <span className="user-info">
        👤 {user.email}
      </span>
      <button
        className="btn btn-secondary btn-small"
        onClick={handleSignOut}
      >
        ログアウト
      </button>
    </div>
  )
}