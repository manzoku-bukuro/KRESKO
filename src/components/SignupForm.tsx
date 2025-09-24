import { useState } from 'react';
import { createEmailAccount, signInWithGoogle } from '../utils/auth';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    // バリデーション
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);
    try {
      await createEmailAccount(formData.email, formData.password);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に登録されています');
      } else if (error.code === 'auth/invalid-email') {
        setError('有効なメールアドレスを入力してください');
      } else {
        setError('アカウント作成に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch {
      setError('Googleでの登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>新規会員登録</h2>

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
            minLength={6}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード確認</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '登録中...' : '📧 メールで登録'}
        </button>
      </form>

      <div className="auth-divider">
        <span>または</span>
      </div>

      <button
        type="button"
        className="btn btn-google"
        onClick={handleGoogleSignup}
        disabled={loading}
      >
        🔍 Googleで登録
      </button>

      <div className="auth-switch">
        <p>
          すでにアカウントをお持ちですか？
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;