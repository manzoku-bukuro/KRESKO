import { SignupFormView } from './SignupForm.view'
import { useSignupForm } from './hooks/useSignupForm'
import type { SignupFormProps } from './SignupForm.types'

export const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const { state, actions } = useSignupForm({ onSuccess })

  return (
    <SignupFormView
      state={state}
      actions={actions}
      onSwitchToLogin={onSwitchToLogin}
    />
  )
}