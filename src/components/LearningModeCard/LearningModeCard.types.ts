import type { LucideIcon } from 'lucide-react'

export interface LearningModeCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  color?: 'primary' | 'secondary' | 'accent'
  badge?: number
}
