import { LoginFormView } from './LoginForm.View'
import { useLoginForm } from './hooks/useLoginForm'
import type { LoginFormProps } from './LoginForm.types'

export const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const { state, actions } = useLoginForm({ onSuccess })

  return (
    <LoginFormView
      state={state}
      actions={actions}
      onSwitchToSignup={onSwitchToSignup}
    />
  )
}