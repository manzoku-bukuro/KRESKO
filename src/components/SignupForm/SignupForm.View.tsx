import type { SignupFormState, SignupFormActions, SignupFormProps } from './SignupForm.types'

interface SignupFormViewProps {
  state: SignupFormState
  actions: SignupFormActions
  onSwitchToLogin?: SignupFormProps['onSwitchToLogin']
}

export const SignupFormView = ({ state, actions, onSwitchToLogin }: SignupFormViewProps) => {
  const { formData, loading, error } = state
  const { handleChange, handleSubmit, handleGoogleSignup } = actions

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
  )
}