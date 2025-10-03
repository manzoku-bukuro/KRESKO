import { useState, useCallback } from 'react'
import { createEmailAccount, signInWithGoogle } from '@/utils/auth'
import type { SignupFormState, SignupFormActions, SignupFormProps } from '../SignupForm.types'
import type { SignupFormData } from '@/types'

const getErrorMessage = (errorCode?: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に登録されています'
    case 'auth/invalid-email':
      return '有効なメールアドレスを入力してください'
    case 'auth/popup-closed-by-user':
      return '登録がキャンセルされました'
    default:
      return 'アカウント作成に失敗しました'
  }
}

export const useSignupForm = ({ onSuccess }: Pick<SignupFormProps, 'onSuccess'>) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: SignupFormData) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }, [])

  const validateForm = (data: SignupFormData): string | null => {
    if (!data.email || !data.password || !data.confirmPassword) {
      return 'すべての項目を入力してください'
    }

    if (data.password !== data.confirmPassword) {
      return 'パスワードが一致しません'
    }

    if (data.password.length < 6) {
      return 'パスワードは6文字以上で入力してください'
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
      await createEmailAccount(formData.email, formData.password)
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string }
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }, [formData, onSuccess])

  const handleGoogleSignup = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (err: unknown) {
      const error = err as { code?: string }
      if (error.code === 'auth/popup-closed-by-user') {
        setError('登録がキャンセルされました')
      } else {
        setError('Googleでの登録に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const state: SignupFormState = {
    formData,
    loading,
    error
  }

  const actions: SignupFormActions = {
    handleChange,
    handleSubmit,
    handleGoogleSignup
  }

  return {
    state,
    actions
  }
}