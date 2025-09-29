import type { ChoiceButtonsProps, ChoiceButtonsState, ChoiceButtonsActions } from './ChoiceButtons.types'

interface ChoiceButtonsViewProps {
  props: ChoiceButtonsProps
  state: ChoiceButtonsState
  actions: ChoiceButtonsActions
}

export const ChoiceButtonsView = ({ props, actions }: ChoiceButtonsViewProps) => {
  const {
    choices,
    selectedAnswer,
    correctAnswer,
    showResult,
    instruction = '',
    loadingMessage = '選択肢を生成中...',
    className = ''
  } = props
  const { handleChoiceClick } = actions

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {instruction && (
        <p className="text-center text-muted mb-md text-sm">
          {instruction}
        </p>
      )}

      {choices.length === 0 && (
        <p className="text-muted text-center">
          {loadingMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-xs w-full max-w-lg">
        {choices.map((choice, idx) => {
          const isSelected = selectedAnswer === choice
          const isCorrect = choice === correctAnswer

          let buttonClasses = `
            w-full py-md px-lg text-left rounded-md border
            transition-all duration-fast font-medium text-base
            min-h-12 flex items-center justify-center
            hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
          `

          if (showResult && isSelected) {
            buttonClasses += isCorrect
              ? ' bg-success text-white border-success hover:bg-green-600'
              : ' bg-danger text-white border-danger hover:bg-red-600'
          } else if (showResult && isCorrect) {
            buttonClasses += ' bg-success text-white border-success hover:bg-green-600'
          } else if (isSelected) {
            buttonClasses += ' bg-primary text-white border-primary hover:bg-primary-dark'
          } else {
            buttonClasses += ' bg-secondary hover:bg-secondary-hover text-text border-border'
          }

          return (
            <button
              key={idx}
              className={buttonClasses}
              onClick={() => handleChoiceClick(choice)}
              disabled={!!selectedAnswer}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}