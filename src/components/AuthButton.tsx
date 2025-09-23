import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser, isAnonymousUser } from '../utils/auth';

const AuthButton = () => {
  const { user, signInAsGuestHandler } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        className="btn btn-primary"
        onClick={signInAsGuestHandler}
        disabled={loading}
      >
        🎮 ゲストで始める
      </button>
    );
  }

  const isGuest = isAnonymousUser();

  return (
    <div className="auth-status">
      <span className="user-info">
        {isGuest ? '🎮 ゲストユーザー' : `👤 ${user.email}`}
      </span>
      <button
        className="btn btn-secondary btn-small"
        onClick={handleSignOut}
        disabled={loading}
      >
        ログアウト
      </button>
    </div>
  );
};

export default AuthButton;