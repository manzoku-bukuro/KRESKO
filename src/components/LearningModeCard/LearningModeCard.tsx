import { ArrowRight } from 'lucide-react'
import type { LearningModeCardProps } from './LearningModeCard.types'

export const LearningModeCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  color = 'primary',
  badge,
}: LearningModeCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/15 hover:bg-primary/20',
    secondary: 'bg-blue-500/15 hover:bg-blue-500/20',
    accent: 'bg-amber-500/15 hover:bg-amber-500/20',
  }

  const iconColorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-blue-500 text-white',
    accent: 'bg-amber-500 text-white',
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="learning-mode-card"
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
    >
      <div className={`p-5 transition-colors ${colorClasses[color]}`}>
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg shadow-sm ${iconColorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-family-main, sans-serif)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                lineHeight: 1.4,
                margin: 0
              }}>{title}</h3>
              {badge !== undefined && badge > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '1.25rem',
                  padding: '0 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                  borderRadius: '0.25rem'
                }}>
                  {badge}
                </span>
              )}
            </div>
            <p style={{
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>{description}</p>
          </div>

          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background border border-border transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4 text-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}
