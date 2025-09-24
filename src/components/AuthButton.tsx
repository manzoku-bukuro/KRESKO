import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const AuthButton = () => {
  const { user, signOutHandler } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSignOut = async () => {
    try {
      await signOutHandler();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openSignupModal = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

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
    );
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
  );
};

export default AuthButton;