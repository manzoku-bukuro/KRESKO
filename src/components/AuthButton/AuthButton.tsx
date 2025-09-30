import { AuthButtonView } from './AuthButton.view'
import { useAuthButton } from './hooks/useAuthButton'

export const AuthButton = () => {
  const { data, actions } = useAuthButton()

  return <AuthButtonView data={data} actions={actions} />
}