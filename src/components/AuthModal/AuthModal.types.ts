export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export type AuthMode = 'login' | 'signup'

export interface AuthModalViewProps {
  isOpen: boolean
  mode: AuthMode
  onClose: () => void
  onOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onSuccess: () => void
  onSwitchToLogin: () => void
  onSwitchToSignup: () => void
}