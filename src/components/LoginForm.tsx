import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../utils/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(formData.email, formData.password);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/user-not-found') {
        setError('アカウントが見つかりません');
      } else if (error.code === 'auth/wrong-password') {
        setError('パスワードが間違っています');
      } else if (error.code === 'auth/invalid-email') {
        setError('有効なメールアドレスを入力してください');
      } else if (error.code === 'auth/user-disabled') {
        setError('このアカウントは無効になっています');
      } else {
        setError('ログインに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/popup-closed-by-user') {
        setError('ログインがキャンセルされました');
      } else {
        setError('Googleログインに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>ログイン</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'ログイン中...' : '📧 メールでログイン'}
        </button>
      </form>

      <div className="auth-divider">
        <span>または</span>
      </div>

      <button
        type="button"
        className="btn btn-google"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        🔍 Googleでログイン
      </button>

      <div className="auth-switch">
        <p>
          アカウントをお持ちでない方は
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignup}
            disabled={loading}
          >
            新規登録
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;