export interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}

export interface LoginFormData {
  email: string
  password: string
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