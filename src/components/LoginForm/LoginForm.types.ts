import type { LoginFormData } from '@/types'

export interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}

export interface LoginFormState {
  formData: LoginFormData
  loading: boolean
  error: string
}

export interface LoginFormActions {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleGoogleLogin: () => Promise<void>
}
