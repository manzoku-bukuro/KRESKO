/**
 * 認証モード
 */
export type AuthMode = 'login' | 'signup'

/**
 * ログインフォームデータ
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * サインアップフォームデータ
 */
export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}
