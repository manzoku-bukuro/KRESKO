import { useState, useCallback } from 'react'
import { signInWithEmail, signInWithGoogle } from '@/utils/auth'
import type { LoginFormState, LoginFormActions, LoginFormProps } from '../LoginForm.types'
import type { LoginFormData } from '@/types'

const getErrorMessage = (errorCode?: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'アカウントが見つかりません'
    case 'auth/wrong-password':
      return 'パスワードが間違っています'
    case 'auth/invalid-email':
      return '有効なメールアドレスを入力してください'
    case 'auth/user-disabled':
      return 'このアカウントは無効になっています'
    case 'auth/popup-closed-by-user':
      return 'ログインがキャンセルされました'
    default:
      return 'ログインに失敗しました'
  }
}

export const useLoginForm = ({ onSuccess }: Pick<LoginFormProps, 'onSuccess'>) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: LoginFormData) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }, [])

  const validateForm = (data: LoginFormData): string | null => {
    if (!data.email || !data.password) {
      return 'メールアドレスとパスワードを入力してください'
    }
    return null
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await signInWithEmail(formData.email, formData.password)
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string }
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }, [formData, onSuccess])

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string }
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const state: LoginFormState = {
    formData,
    loading,
    error
  }

  const actions: LoginFormActions = {
    handleChange,
    handleSubmit,
    handleGoogleLogin
  }

  return {
    state,
    actions
  }
}