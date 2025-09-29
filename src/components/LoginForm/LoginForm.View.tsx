import type { LoginFormState, LoginFormActions, LoginFormProps } from './LoginForm.types'

interface LoginFormViewProps {
  state: LoginFormState
  actions: LoginFormActions
  onSwitchToSignup?: LoginFormProps['onSwitchToSignup']
}

export const LoginFormView = ({ state, actions, onSwitchToSignup }: LoginFormViewProps) => {
  const { formData, loading, error } = state
  const { handleChange, handleSubmit, handleGoogleLogin } = actions

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
  )
}