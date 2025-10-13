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
    <div style={{ width: '100%' }}>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: 'var(--color-text)',
          textAlign: 'center',
        }}
      >
        新規会員登録
      </h2>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            backgroundColor: 'rgb(254 226 226)',
            border: '1px solid rgb(248 113 113)',
            borderRadius: '0.375rem',
            color: 'rgb(153 27 27)',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text)',
            }}
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--color-border)',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text)',
            }}
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--color-border)',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text)',
            }}
          >
            パスワード確認
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--color-border)',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: loading ? 'var(--color-muted)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)'
            }
          }}
        >
          {loading ? '登録中...' : '📧 メールで登録'}
        </button>
      </form>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          margin: '1.5rem 0',
          position: 'relative',
        }}
      >
        <div
          style={{
            flex: 1,
            borderTop: '1px solid var(--color-border)',
          }}
        />
        <span
          style={{
            padding: '0 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-muted)',
          }}
        >
          または
        </span>
        <div
          style={{
            flex: 1,
            borderTop: '1px solid var(--color-border)',
          }}
        />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.375rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
          }
        }}
      >
        🔍 Googleで登録
      </button>

      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--color-muted)',
        }}
      >
        <p style={{ margin: 0 }}>
          すでにアカウントをお持ちですか？
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={loading}
            style={{
              marginLeft: '0.25rem',
              padding: 0,
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  )
}