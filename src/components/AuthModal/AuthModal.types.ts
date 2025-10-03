import type { AuthMode } from '@/types'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: AuthMode
}

export interface AuthModalViewProps {
  isOpen: boolean
  mode: AuthMode
  onClose: () => void
  onOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onSuccess: () => void
  onSwitchToLogin: () => void
  onSwitchToSignup: () => void
}
