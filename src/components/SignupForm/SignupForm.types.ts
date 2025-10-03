import type { SignupFormData } from '@/types'

export interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export interface SignupFormState {
  formData: SignupFormData
  loading: boolean
  error: string
}

export interface SignupFormActions {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleGoogleSignup: () => Promise<void>
}
