import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

export type AuthMode = 'login' | 'signup'

export interface AuthButtonData {
  user: any | null
  showAuthModal: boolean
  authMode: AuthMode
  loading: boolean
}

export interface AuthButtonActions {
  handleSignOut: () => Promise<void>
  openLoginModal: () => void
  openSignupModal: () => void
  closeAuthModal: () => void
}

export const useAuthButton = () => {
  const { user, signOutHandler, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  const handleSignOut = async () => {
    try {
      await signOutHandler()
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const openLoginModal = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const openSignupModal = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const data: AuthButtonData = {
    user,
    showAuthModal,
    authMode,
    loading
  }

  const actions: AuthButtonActions = {
    handleSignOut,
    openLoginModal,
    openSignupModal,
    closeAuthModal
  }

  return {
    data,
    actions
  }
}