import { ModeToggle } from '../ModeToggle'
import type { QuizHeaderProps, QuizHeaderState, QuizHeaderActions } from './QuizHeader.types'

interface QuizHeaderViewProps {
  props: QuizHeaderProps
  state: QuizHeaderState
  actions: QuizHeaderActions
}

export const QuizHeaderView = ({ props }: QuizHeaderViewProps) => {
  const {
    title,
    currentQuestion,
    totalQuestions,
    subtitle,
    showModeToggle = false,
    modeToggleProps,
    className = ''
  } = props

  return (
    <div className={`text-center mb-md ${className}`}>
      <h2 className="text-xl font-bold text-text mb-xs">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm text-muted mb-xs">
          {subtitle}
        </p>
      )}

      <p className="text-sm text-muted font-medium">
        問題 {currentQuestion} / {totalQuestions}
      </p>

      {showModeToggle && modeToggleProps && (
        <div className="mt-sm">
          <ModeToggle
            currentMode={modeToggleProps.currentMode}
            onModeChange={modeToggleProps.onModeChange}
            traditionalLabel={modeToggleProps.traditionalLabel}
            multipleChoiceLabel={modeToggleProps.multipleChoiceLabel}
          />
        </div>
      )}
    </div>
  )
}