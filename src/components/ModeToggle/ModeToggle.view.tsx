import type { ModeToggleProps, ModeToggleState, ModeToggleActions } from './ModeToggle.types'

interface ModeToggleViewProps {
  props: ModeToggleProps
  state: ModeToggleState
  actions: ModeToggleActions
}

export const ModeToggleView = ({ props, actions }: ModeToggleViewProps) => {
  const {
    currentMode,
    traditionalLabel = '👁️ 表示形式',
    multipleChoiceLabel = '✅ 4択形式',
    className = ''
  } = props
  const { handleTraditionalClick, handleMultipleChoiceClick } = actions

  return (
    <div className={`flex gap-sm justify-center mt-md w-full max-w-sm mx-auto ${className}`}>
      <button
        className={`
          flex-1 max-w-44 font-normal px-md py-sm whitespace-nowrap min-h-10 text-sm
          transition-all duration-fast rounded-md
          ${currentMode === 'traditional'
            ? 'bg-primary hover:bg-primary-dark text-white border border-primary'
            : 'bg-secondary hover:bg-secondary-dark text-text border border-secondary'
          }
        `}
        onClick={handleTraditionalClick}
      >
        {traditionalLabel}
      </button>
      <button
        className={`
          flex-1 max-w-44 font-normal px-md py-sm whitespace-nowrap min-h-10 text-sm
          transition-all duration-fast rounded-md
          ${currentMode === 'multiple-choice'
            ? 'bg-primary hover:bg-primary-dark text-white border border-primary'
            : 'bg-secondary hover:bg-secondary-dark text-text border border-secondary'
          }
        `}
        onClick={handleMultipleChoiceClick}
      >
        {multipleChoiceLabel}
      </button>
    </div>
  )
}