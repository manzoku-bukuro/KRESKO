import { useState } from 'react'
import type { AuthMode } from '../AuthModal.types'

export const useAuthModal = (defaultMode: AuthMode = 'login') => {
  const [mode, setMode] = useState<AuthMode>(defaultMode)

  const switchToLogin = () => setMode('login')
  const switchToSignup = () => setMode('signup')

  return {
    mode,
    switchToLogin,
    switchToSignup,
  }
}